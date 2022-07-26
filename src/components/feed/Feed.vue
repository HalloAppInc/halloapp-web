
<script setup lang="ts">

    import { ref, watchEffect, defineExpose, defineEmits } from 'vue'

    import { useMainStore } from '../../stores/mainStore'

    import Post from '../home/Post.vue'
    import Comment from '../comment/CommentMain.vue'
    import hal from '../../common/halogger'

    const mainStore = useMainStore()

    const listBoxWidth = ref('100%')
    const showComments = ref(false)

    const props = defineProps(['postsList'])

    const inViewPostID = ref('')

    const content = ref<HTMLElement | null>(null)
    let handleScrollTimer: any

    const emit = defineEmits<{(e: 'commentsClick', postID: string): void}>()

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

    defineExpose({
        closeCommentsPanel
    })

</script>

<template>

    <div class="feedWrapper">
        
        <div class="listBox" ref='content' @scroll='handleScroll()'>

            <slot name="header"></slot>

            <!-- <div class='header'>
                
            </div> -->

            <div v-for="value in props.postsList" class="container">
                <!-- data-ha-postID is used only for detecting post while scrolling -->
                <Post
                    :postID="value.postID"
                    userID="value.userID" 
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
        width: 5px;
    }

    *::-webkit-scrollbar-track {
        background: white;        /* color of the tracking area */
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
