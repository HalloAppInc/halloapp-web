
<script setup lang="ts">
import { ref } from 'vue'

import { useMainStore } from '../../stores/mainStore'

import HomeHeader from './HomeHeader.vue'
import Post from './Post.vue'
import Comment from '../comment/CommentMain.vue'
import hal from '../../common/halogger'

const mainStore = useMainStore()

const listBoxWidth = ref('100%')
const showComments = ref(false)

const inViewPostID = ref('')

const content = ref<HTMLElement | null>(null)
let handleScrollTimer: any

const listData = [
    { 
        userID: "xxx",
        title: "Thou with no name",
        subtitle: "this is a link",
        timestamp: "now",
        postID: "1"
    },
    { 
        userID: "xxx",
        title: "Tree",
        subtitle: "apple",
        timestamp: "now",
        postID: "2"
    },
    { 
        userID: "xxx",
        title: "Bob",
        subtitle: "this is a link",
        timestamp: "now",
        postID: "3"
    },     
    { 
        userID: "xxx",
        title: "Jessy",
        subtitle: "this is a link",
        timestamp: "now",
        postID: "4"
    },
    { 
        userID: "xxx",
        title: "Nathan",
        subtitle: "this is a link",
        timestamp: "now",
        postID: "5"
    },
    { 
        userID: "xxx",
        title: "Kai",
        subtitle: "this is a link",
        timestamp: "now",
        postID: "6"
    },
    { 
        userID: "xxx",
        title: "Rebecca",
        subtitle: "this is a link",
        timestamp: "now",
        postID: "7"
    },     
    { 
        userID: "xxx",
        title: "Dylan",
        subtitle: "this is a link",
        timestamp: "now",
        postID: "8"
    },          
]

function commentsClick(postID: string) {
    if (listBoxWidth.value == '100%') {
        let width = '500px'
        if (mainStore.isMobile) {
            width = '0px'
        }
        listBoxWidth.value = width

        inViewPostID.value = postID
        showComments.value = true
        mainStore.homePanel = 'comments'
    } else {
        listBoxWidth.value = '100%'

        inViewPostID.value = ''
        showComments.value = false
        mainStore.homePanel = ''
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

</script>

<template>

<div class="wrapper">
    
    <div class="listBox" ref='content' @scroll='handleScroll()'>

        <div class='header'>
            <HomeHeader/>
        </div>

        <div v-for="value in listData" class="container">
            <!-- data-ha-postID is used only for detecting post while scrolling -->
            <Post 
                :postID="value.postID"
                userID="value.userID" 
                @commentsClick="commentsClick(value.postID)" 
                :data-ha-postID="value.postID"> 
            </Post>
        </div>
    </div>
 
    <div v-if="showComments" class="comments">
        <Comment :postID='inViewPostID' @backClick="commentsClick"></Comment>
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

.wrapper {
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
    z-index: 2;
    background-color: #f0f2f5;
}

.comments {
    flex: 1 1 auto;
    height: 100%;
    
    overflow-y: auto;
    overflow-x: hidden;
    transition: 1s all ease-in-out;
}

</style>
