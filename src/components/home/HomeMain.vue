
<script setup lang="ts">
    import { Ref, ref, watch, watchEffect, computed } from 'vue'

    import { useMainStore } from '../../stores/mainStore'
    import { useConnStore } from '../../stores/connStore'
    import { useColorStore } from '../../stores/colorStore'

    import HomeHeader from './HomeHeader.vue'
    import Post from './Post.vue'
    import Comment from '../comment/CommentMain.vue'
    import hal from '../../common/halogger'

    import { Dexie, liveQuery } from "dexie"
    import { db, Feed, PostMedia, Mention } from '../../db'

    import { useI18n } from 'vue-i18n'

    import { clients } from "../../proto/clients.js"
    import { useTimeformatter } from '../../composables/timeformatter'

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    const { formatTime, formatTimer } = useTimeformatter()

    const listBoxWidth = ref('100%')
    const showComments = ref(false)

    const inViewPostID = ref('')

    const content = ref<HTMLElement | null>(null)
    let handleScrollTimer: any

    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const listData: Ref<Feed[]> = ref([])

    const feedObservable = liveQuery (() => db.feed
        .reverse()
        .sortBy('timestamp')
        
    )

    // Subscribe
    const subscription = feedObservable.subscribe({
        next: result => { 
            // console.log('homeMain/feedObservable: ', JSON.stringify(result))
            if (result) {
                listData.value = result
            }

        },
        error: error => console.error(error)
    })

    init()

    async function init() {
        const cursor = ''
        console.log('homeMain/init')
        connStore.requestFeedItems(cursor, 3, function() {})

    }

    watchEffect(() => {
        if (mainStore.scrollToTop == 'home') {
            scrollToTop()
            mainStore.scrollToTop = ''
        }
    })

    function scrollToTop() {    
        content.value?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }

    function openCommentsIfNeeded(postID: string) {
        if (showComments.value) {
            inViewPostID.value = postID
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
        handleScrollTimer = setTimeout(debouncedHandleScroll, 250)
    }

    function debouncedHandleScroll() {
        if (!content.value) { return }

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
    }

    const backgroundColor = computed(() => {
        return colorStore.background
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
    background: white;        /* color of the tracking area */
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
