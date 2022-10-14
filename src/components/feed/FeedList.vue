<script setup lang="ts">
    import { Ref, ref, watchEffect, onActivated, onBeforeUnmount } from 'vue'
    import { liveQuery } from 'dexie'
    import { storeToRefs } from 'pinia'

    import { db, Post } from '@/db'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import hal from '@/common/halogger'

    import PostComponent from '@/components/feed/Post.vue'
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

    const dbListData: Ref<Post[]> = ref([])
    const listData: Ref<Post[]> = ref([])
    const count = ref(5)

    const inViewPostID = ref('')

    let savedScrollTop = 0 // store scroll position

    const content = ref<HTMLElement | null>(null)
    let handleScrollTimer: any

    let postObservable: any

    if (props.atMainFeed) {
        postObservable = liveQuery (() => db.post
            .reverse()
            .sortBy('timestamp')
        )
    } else if (props.groupID) {

        const groupId = props.groupID

        postObservable = liveQuery (() => db.post.where('groupID').equals(groupId)
            .reverse()
            .sortBy('timestamp')
        )
    }

    const subscription = postObservable.subscribe({
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

        /* at main feed */
        if (props.atMainFeed) {
            if (mainStore.scrollToTop != 'home') { return }

            scrollToTop()
            mainStore.scrollToTop = ''
        } 
        
        /* at group feed */
        else if (!props.atMainFeed) {
            
            if (mainStore.scrollToTop == props.groupID) {
           
                scrollToTop()
                mainStore.scrollToTop = ''
            }
        }

    })

    const showNewPostsButton = ref(false)

    function makeList() {

        if (!content) { return }

        // if (content.value) {

        //     if (content.value.scrollTop > 200) {

        //         const dbLatestItem = dbListData.value[0]
        //         const latestItem = listData.value[0]

        //         if (dbLatestItem.timestamp > latestItem.timestamp) {
        //             showNewPostsButton.value = true
        //             return
        //         }

        //     }
            
        // }



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

        mainStore.triggerFirstInteraction()

        /* comments panel already opened */
        if (showComments.value) {
          
            // close comment if user clicked on the same post after open
            if (inViewPostID.value == postID) {
                toggleCommentsPanel(postID)
            } else {
                getComments(postID)
                inViewPostID.value = postID
            }

        } 
        
        /* comments panel closed */
        else {
            getComments(postID)
            toggleCommentsPanel(postID)
        }
    }

    function commentsBackClick() {
        toggleCommentsPanel('')
    }


    async function getComments(postID: string) {
     
        const numComments = await db.comment.where('postID').equals(postID).count()
        if (numComments < 30) {
            let commentCursor = ''
            if (mainStore.commentCursors[postID]) {
                commentCursor = mainStore.commentCursors[postID]
            }      
            connStore.requestComments(postID, commentCursor, 20, function() {})
        }
             
    }

    function toggleCommentsPanel(postID: string) {

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
        /* turning off for now, seems jarring to have the comments panel switch by itself when the user is just scrolling */
        // const contentViewportRect = content.value.getBoundingClientRect()
        // const pointX = (contentViewportRect.width / 2) + contentViewportRect.left
        // const pointY = contentViewportRect.top + 100
        
        // const closestTopElement = document.elementFromPoint(pointX, pointY)
        // const closestElement = closestTopElement?.closest('[data-ha-postID]')

        // if (closestElement) {
        //     const attr = closestElement.getAttribute('data-ha-postID')
        //     if (attr) {
        //         inViewPostID.value = attr
        //     }
        // }

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

        /* handle new posts that have come in */
        if (element.scrollTop < 200 && showNewPostsButton.value) {
            makeList()
            showNewPostsButton.value = false
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
        
        <!-- new posts button -->
        <transition name='newPostsButton'>
            <div class='newPostsButton' v-show='showNewPostsButton' @click="scrollToTop()">
                <div class="newPostsText">
                    New Posts
                </div>
                
            </div>
        </transition>

        <div class="listBox" ref='content' @scroll='handleScroll()'>

            <slot name="header"></slot>

            <div v-for="value in listData" class="container">
                <!-- data-ha-postID is used only for detecting post while scrolling -->
                <PostComponent
                    :post="value"
                    :postID="value.postID"
                    userID="value.userID"
                    :atMainFeed="props.atMainFeed"
                    @commentsClick="openCommentsIfNeeded(value.postID)" 
                    :data-ha-postID="value.postID"
                    
                    :key="value.postID"
                    > 
                </PostComponent>
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
        position: relative;
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

    .newPostsButton {
        position: absolute;

        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
 
        top: 75px;
        
        z-index: 4;

        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .newPostsButton:hover {
        cursor: pointer;
    }

    .newPostsButton .newPostsText {
        padding: 10px 20px 10px 20px;
        border-radius: 30px;
        
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        background-color: rgb(172, 169, 169, 0.5);
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

    .newPostsButton-enter-active, .newPostsButton-leave-active {
        transition: all 0.5s ease
    }

    .newPostsButton-enter-from, .newPostsButton-leave-to {
        transform: scale(0.1);
        opacity: 0;
    }

</style>
