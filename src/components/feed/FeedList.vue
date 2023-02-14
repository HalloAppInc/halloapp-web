<script setup lang='ts'>
    import { Ref, ref, watch, watchEffect, onActivated, onBeforeUnmount, onMounted } from 'vue'
    import { liveQuery } from 'dexie'
    import { storeToRefs } from 'pinia'

    import { db, Post } from '@/db'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import { gotNewPost } from '@/composables/haFeed'
    import { useHAComment } from '@/composables/haComment'
    import { useHAGroup } from '@/composables/haGroup'

    import hal from '@/common/halogger'

    import Moments from '@/components/moment/Moments.vue'
    import PostComponent from '@/components/feed/Post.vue'
    import Comment from '@/components/comment/CommentMain.vue'
    
    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    // const { gotNewPost } = useHAFeed()
    const { requestCommentsIfNeeded, requestComments } = useHAComment()
    const { requestGroupFeedItems } = useHAGroup()

    const listBoxWidth = ref('100%')
    const showComments = ref(false)

    interface Props {
        atMainFeed: boolean,
        groupID?: string
    }
    const props = defineProps<Props>()

    const { 
        page: mainStorePage
    } = storeToRefs(mainStore)  

    const { 
        isConnectedToMobile
    } = storeToRefs(connStore)  

    const { 
        background: backgroundColor
    } = storeToRefs(colorStore)  

    const dbListData: Ref<Post[]> = ref([])
    const listData: Ref<Post[]> = ref([])
    const count = ref(5)

    const momentsListData: Ref<Post[]> = ref([])

    const inViewPostID: Ref<string | undefined> = ref()

    const postWidth = ref(420)

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

    /* revisit new post dot indicator to see if it's needed and if so, can it be simplified */
    if (props.atMainFeed) {
        watch(gotNewPost, (newVal, oldVal) => {
            if (!content.value) { return }
            const element = content.value
            if (mainStore.page != 'home' || (mainStore.page == 'home' && element.scrollTop > 200)) {
                mainStore.showNewPostsDotIndicator = true
            }
        })

        watch(mainStorePage, (newVal, oldVal) => {
            if (!content.value) { return }
            const element = content.value
            if (mainStore.page == 'home') {
                if (element.scrollTop < 200) {
                    mainStore.showNewPostsDotIndicator = false
                }
            }
        })

    }

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

        const normalPosts = dbListData.value.filter( item => !item.moment )
        momentsListData.value = dbListData.value.filter( item => item.moment )

        if (!content || !content.value) { return }

        if (content.value) {
            if (content.value.scrollTop > 200) {
                const normalPostsLatestItem = normalPosts[0]
                const latestItem = listData.value[0]
                if (normalPostsLatestItem.timestamp > latestItem.timestamp) {
                    showNewPostsButton.value = true
                }
            }
        }

        if (normalPosts.length > count.value) {
            listData.value = normalPosts.slice(0, count.value)
        } else {
            listData.value = normalPosts
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
                loadComments(postID)
                inViewPostID.value = postID
                mainStore.showGroupsCommentsPostID = postID
            }
        } 
        
        /* comments panel closed */
        else {
            loadComments(postID)
            toggleCommentsPanel(postID)
        }
    }

    function commentsBackClick() {
        toggleCommentsPanel('')
    }

    async function loadComments(postID: string) {
     
        const numComments = await db.comment.where('postID').equals(postID).count()
        if (numComments < 30) {
            requestCommentsIfNeeded(postID, 20, function() {})
        }
             
    }

    function toggleCommentsPanel(postID: string) {

        if (listBoxWidth.value == '100%') {            
            requestComments(postID, '', 3, function() {}) // manual check for missed updates, might not be needed after we have a key to mark our last update
            openCommentsPanel(postID)
        } 
        else {
            closeCommentsPanel()
        }

        // emit('commentsClick', postID)
    }

    function openCommentsPanel(postID: string) {

        inViewPostID.value = postID
        if (!props.atMainFeed) {
            
            mainStore.showGroupsCommentsPostID = postID

        }
        let width = '500px'
            if (mainStore.isMobile) {
                width = '0px'
            }
        listBoxWidth.value = width

        showComments.value = true
        mainStore.showGroupsSidebar = false
        mainStore.showGroupsCommentsPanel = true
    }

    function closeCommentsPanel() {
        listBoxWidth.value = '100%'
        showComments.value = false
        mainStore.showGroupsSidebar = true
        mainStore.showGroupsCommentsPanel = false
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
        const element = content.value
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
                requestGroupFeedItems(groupID, groupCursor, 50, function() {})
            }

            count.value += 5
            makeList()
        }

        /* handle new posts that have come in */
        if (element.scrollTop < 200 && showNewPostsButton.value) {
            makeList()
            showNewPostsButton.value = false
        }

        if (props.atMainFeed) {
            if (element.scrollTop < 200) {
                mainStore.showNewPostsDotIndicator = false
            }
        }

        savedScrollTop = element.scrollTop

    }

    onMounted(() => {
        if (mainStore.showGroupsCommentsPanel) {
            if (!props.atMainFeed) {
                openCommentsPanel(mainStore.showGroupsCommentsPostID)
            }
        }
    })

    onActivated(() => {
        if (!content.value) { return }
        let element = content.value
        element.scrollTop = savedScrollTop

        if (props.atMainFeed) {
            if (element.scrollTop < 200) {
                mainStore.showNewPostsDotIndicator = false
            }
        }

    })

    defineExpose({
        closeCommentsPanel
    })

    function setPostSize() {
        const maxPostWidth = 420    // max width of entire card allowed
        const minPostWidth = 200    // min width of card

        const sideGutters = 60

        // limit post to maxPostWidth if window is large
        if (window.innerWidth >= maxPostWidth) {
            postWidth.value = maxPostWidth - sideGutters

        // size post to window's size
        } else if (window.innerWidth < maxPostWidth && window.innerWidth >= minPostWidth) {
            postWidth.value = window.innerWidth - 80

        // if window is too small, keep post to minPostWidth
        } else if (window.innerWidth < minPostWidth) {
            postWidth.value = minPostWidth
        }
    }

    setPostSize()
    if (!props.atMainFeed && props.groupID) {
        initGroupFeed()
    }

    async function initGroupFeed() {
        const groupID = mainStore.groupsPageGroupID
        if (!mainStore.groupFeedCursors[groupID]) {
            let groupCursor = ''
            groupCursor = mainStore.groupFeedCursors[groupID]
            requestGroupFeedItems(groupID, groupCursor, 10, function() {})
        }
    }    

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

        <div class='listBox' ref='content' @scroll='handleScroll()'>

            <slot name='header'></slot>

            <div v-if='momentsListData.length > 0' class='momentsRow'>
                
                <Moments
                    :momentPosts='momentsListData'
                    :postWidth='postWidth'>
                </Moments>
               
            </div>

            <div v-for='value in listData' class='container' :key='value.postID'>
                <!-- data-ha-postID is used only for detecting post while scrolling -->
                <PostComponent :key='value.postID'
                    :post='value'
                    :postID='value.postID'
                    :userID='value.userID'
                    :atMainFeed='props.atMainFeed'
                    :postWidth='postWidth'
                    @commentsClick='openCommentsIfNeeded(value.postID)'
                    :data-ha-postID='value.postID'> 
                </PostComponent>
            </div>
        </div>
    
        <div v-if="inViewPostID" v-show="showComments" class='comments'>
            <keep-alive>
                <Comment :postID="inViewPostID" @backClick="commentsBackClick" :key="inViewPostID"></Comment>
            </keep-alive>
        </div>
    
    </div>

</template>

<style scoped>
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

        /* display: flex;
        flex-direction: column; */
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

    .momentsRow {
        margin-bottom: 10px;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
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
