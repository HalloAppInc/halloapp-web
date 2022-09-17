<script setup lang="ts">
    import { Ref, ref, watchEffect, onActivated, onBeforeUnmount } from 'vue'
    import { liveQuery } from 'dexie'
    import { storeToRefs } from 'pinia'

    import { db, Feed } from '@/db'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import hal from '@/common/halogger'

    import Post from '@/components/home/Post.vue'
    import Comment from '@/components/comment/CommentMain.vue'
    
    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    const listBoxWidth = ref('100%')
    const showComments = ref(false)

    interface Props {
        atMainFeed: boolean,
        groupID?: string
    }
    const props = defineProps<Props>()

    const { 
        background: backgroundColor
    } = storeToRefs(colorStore)  

    const dbListData: Ref<Feed[]> = ref([])
    const listData: Ref<Feed[]> = ref([])
    const count = ref(5)

    const inViewPostID = ref('')

    let savedScrollTop = 0 // store scroll position

    const content = ref<HTMLElement | null>(null)
    let handleScrollTimer: any

    let feedObservable: any

    if (props.atMainFeed) {
        feedObservable = liveQuery (() => db.feed
            .reverse()
            .sortBy('timestamp')
        )
    } else if (props.groupID) {

        const groupId = props.groupID

        feedObservable = liveQuery (() => db.feed.where('groupID').equals(groupId)
            .reverse()
            .sortBy('timestamp')
        )


    }

    const subscription = feedObservable.subscribe({
        next: (result: any) => { 
            if (result) {
                dbListData.value = result
                makeList()
            }
        },
        error: (error: any) => console.error(error)
    })


    const emit = defineEmits<{(e: 'commentsClick', postID: string): void}>()

    watchEffect(() => {
        if (mainStore.scrollToTop == 'home') {
            scrollToTop()
            mainStore.scrollToTop = ''
        }
    })

    function makeList() {
        if (dbListData.value.length > count.value) {
            listData.value = dbListData.value.slice(0, count.value)
        } else {
            listData.value = dbListData.value
        }
    }

    function scrollToTop() {    
        content.value?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }

    function openCommentsIfNeeded(postID: string) {
        if (showComments.value) {
          
            // close comment if user clicked on the same post after open
            if (inViewPostID.value == postID) {
                commentsClick(postID)
            } else {
                inViewPostID.value = postID
            }

        } else {
            commentsClick(postID)
        }
    }

    function commentsBackClick() {
        commentsClick('')
    }

    function commentsClick(postID: string) {

        if (listBoxWidth.value == '100%') {
            let width = '500px'
            if (mainStore.isMobile) {
                width = '0px'
            }
            listBoxWidth.value = width

            inViewPostID.value = postID
            showComments.value = true
            mainStore.mobileNavlessPanel = 'comments'
        } 
        else {
            inViewPostID.value = ''

            closeCommentsPanel()
        }

        emit('commentsClick', postID)
    }

    function closeCommentsPanel() {
        listBoxWidth.value = '100%'
        showComments.value = false
        mainStore.mobileNavlessPanel = ''        
    }

    function handleScroll() {
        clearTimeout(handleScrollTimer)
        handleScrollTimer = setTimeout(debouncedHandleScroll, 200)
    }

    function debouncedHandleScroll() {
        if (!content.value) { return }

        /* auto select post for comments when post is near top */
        const contentViewportRect = content.value.getBoundingClientRect()
        const pointX = (contentViewportRect.width / 2) + contentViewportRect.left
        const pointY = contentViewportRect.top + 100
        
        const closestTopElement = document.elementFromPoint(pointX, pointY)
        const closestElement = closestTopElement?.closest('[data-ha-postID]')

        if (closestElement) {
            const attr = closestElement.getAttribute('data-ha-postID')
            if (attr) {
                inViewPostID.value = attr
            }
        }

        /* fetch more posts before user gets to the end of their feed */
        var element = content.value;
        const scrolled = element.scrollHeight - element.scrollTop
        const nearEnd = element.clientHeight * 3 // 2 screens up
        if (scrolled < nearEnd) {

            if (props.atMainFeed) {

                connStore.requestFeedItems(mainStore.mainFeedNextCursor, 50, function() {})

            } else if (!props.atMainFeed && props.groupID) {

                const groupID = mainStore.groupsPageGroupID
                let groupCursor = ''
                if (mainStore.groupFeedCursors[groupID]) {
                    groupCursor = mainStore.groupFeedCursors[groupID]
                }      
                connStore.requestGroupFeedItems(groupID, groupCursor, 50, function() {})
            }

            count.value += 5
            makeList()
        }

        savedScrollTop = element.scrollTop

    }

    onActivated(() => {
        if (!content.value) { return }
        let element = content.value
        element.scrollTop = savedScrollTop
    })

    if (!props.atMainFeed && props.groupID) {
        initGroupFeed()
    }

    function initGroupFeed() {
        const groupID = mainStore.groupsPageGroupID
        if (!mainStore.groupFeedCursors[groupID]) {
            let groupCursor = ''
            groupCursor = mainStore.groupFeedCursors[groupID]
            connStore.requestGroupFeedItems(groupID, groupCursor, 10, function() {})
        }
    }    

    defineExpose({
        closeCommentsPanel
    })

</script>

<template>

    <div class="feedWrapper">
        
        <div class="listBox" ref='content' @scroll='handleScroll()'>

            <slot name="header"></slot>

            <div v-for="value in listData" class="container">
                <!-- data-ha-postID is used only for detecting post while scrolling -->
                <Post
                    :post="value"
                    :postID="value.postID"
                    userID="value.userID"
                    :atMainFeed="props.atMainFeed"
                    @commentsClick="openCommentsIfNeeded(value.postID)" 
                    :data-ha-postID="value.postID"
                    
                    :key="value.postID"
                    > 
                </Post>
            </div>
        </div>
    
        <div v-if="showComments" class="comments">
            <Comment :postID='inViewPostID' @backClick="commentsBackClick"></Comment>
        </div>
    
    </div>

</template>

<style scoped>

    *::-webkit-scrollbar {
        width: 10px;
    }

    *::-webkit-scrollbar-track {
        background: v-bind(backgroundColor);        /* color of the tracking area */
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgb(172, 169, 169);    /* color of the scroll thumb */

        border: 0px solid white;  /* creates padding around scroll thumb */
    }

    .feedWrapper {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .listBox {
        position: relative;
        flex: 0 0 v-bind(listBoxWidth);
        height: 100%;

        background-color: v-bind(backgroundColor);

        overflow-y: auto;
        overflow-x: hidden;

        transition: flex 300ms ease-in-out;
    }

    .header {
        position: sticky;
        top: 0px;
        width: 100%;
        height: 50px;
        background-color: rgb(243, 243, 240);
        z-index: 2;
    }

    .comments {
        flex: 1 1 auto;
        height: 100%;
        
        overflow-y: auto;
        overflow-x: hidden;
        transition: 1s all ease-in-out;
    }

</style>
