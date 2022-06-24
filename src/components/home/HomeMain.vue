
<script setup lang="ts">
import { ref } from 'vue'

import Post from './Post.vue'
import { useMainStore } from '../../stores/mainStore'
import hal from '../../common/halogger'
const mainStore = useMainStore()

const listBoxWidth = ref('100%')
const showComments = ref(false)

const listData = [
    { 
        userID: "xxx",
        title: "Thou with no name",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        userID: "xxx",
        title: "Tree",
        subtitle: "apple",
        timestamp: "now",
    },
    { 
        userID: "xxx",
        title: "Bob",
        subtitle: "this is a link",
        timestamp: "now",
    },     
    { 
        userID: "xxx",
        title: "Jessy",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        userID: "xxx",
        title: "Nathan",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        userID: "xxx",
        title: "Kai",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        userID: "xxx",
        title: "Rebecca",
        subtitle: "this is a link",
        timestamp: "now",
    },     
    { 
        userID: "xxx",
        title: "Dylan",
        subtitle: "this is a link",
        timestamp: "now",
    },          
]


function commentsClick() {
    if (listBoxWidth.value == '100%') {
        listBoxWidth.value = '500px'
        showComments.value = true
    } else {
        listBoxWidth.value = '100%'
        showComments.value = false
    }
}

</script>

<template>

<div class="wrapper">
    
    
    <div class="listBox"> 
        <div v-for="value in listData" class="container">
            <Post userID="value.userID" @commentsClick="commentsClick"></Post>
        </div>
    </div>
 
    
    <div v-if="showComments" class="comments">

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
    flex: 0 0 v-bind(listBoxWidth);
    height: 100%;
    
    overflow-y: auto;
    overflow-x: hidden;

    transition: flex 300ms ease-in-out;
    
}

.comments {
    flex: 1 1 auto;
    height: 100%;
    
    overflow-y: auto;
    overflow-x: hidden;
    transition: 1s all ease-in-out;
}

</style>
