<script setup lang="ts">
    import { Ref, ref, computed, watchEffect, onMounted, onActivated, onDeactivated } from 'vue'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'
  
    import { db, Feed } from '@/db'
    
    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import hal from '@/common/halogger'

    import HomeHeader from '@/components/home/HomeHeader.vue'
    import Post from '@/components/home/Post.vue'
    import Comment from '@/components/comment/CommentMain.vue'
    
    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    const listBoxWidth = ref('100%')
    const showComments = ref(false)

    const inViewPostID = ref('')

    const content = ref<HTMLElement | null>(null)
    let handleScrollTimer: any

    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const dbListData: Ref<Feed[]> = ref([])
    const listData: Ref<Feed[]> = ref([])

    const count = ref(5)

    const feedObservable = liveQuery (() => db.feed
        .reverse()
        .sortBy('timestamp')
    )

    const subscription = feedObservable.subscribe({
        next: result => { 
            if (result) {
                listData.value = result
            }
        },
        error: error => console.error(error)
    })

    const backgroundColor = computed(() => {
        return colorStore.background
    })

    let savedScrollTop = 0 // store scroll position

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
        } else {
            listBoxWidth.value = '100%'

            inViewPostID.value = ''
            showComments.value = false
            mainStore.mobileNavlessPanel = ''
        }
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
        const nearEnd = element.clientHeight * 4 // 3 screens up
        if (scrolled < nearEnd) {
            connStore.requestFeedItems(mainStore.mainFeedNextCursor, 15, function() {})
        }

        savedScrollTop = element.scrollTop
    }

    onActivated(() => {
        if (!content.value) { return }
        let element = content.value
        element.scrollTop = savedScrollTop
    })

    watchEffect(() => {
        if (mainStore.scrollToTop == 'home') {
            scrollToTop()
            mainStore.scrollToTop = ''
        }
    })    

</script>

<template>

    <div class="homeMainWrapper">
        
        <div class="listBox" ref='content' @scroll='handleScroll()'>

            <div class='header'>
                <HomeHeader/>
            </div>

            <div v-for="value in listData" class="container">
                <!-- data-ha-postID is used only for detecting post while scrolling -->
                <Post
                    :post="value"
                    :postID="value.postID"
                    :userID="value.userID"
                    :atMainFeed=true
                    @commentsClick="openCommentsIfNeeded(value.postID)" 
                    :data-ha-postID="value.postID">
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

    .homeMainWrapper {
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

        overflow-y: auto;
        overflow-x: hidden;

        transition: flex 300ms ease-in-out;

        background-color: v-bind(backgroundColor);
    }

    .header {
        position: sticky;
        top: 0px;
        width: 100%;
        height: 50px;
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
