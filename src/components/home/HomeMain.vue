<script setup lang="ts">

import Post from './Post.vue'
import { useMainStore } from '../../stores/mainStore'
const mainStore = useMainStore()

const listData = [
    { 
        title: "Thou with no name",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        title: "Tree",
        subtitle: "apple",
        timestamp: "now",
    },
    { 
        title: "Bob",
        subtitle: "this is a link",
        timestamp: "now",
    },     
    { 
        title: "Jessy",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        title: "Nathan",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        title: "Kai",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        title: "Rebecca",
        subtitle: "this is a link",
        timestamp: "now",
    },     
    { 
        title: "Dylan",
        subtitle: "this is a link",
        timestamp: "now",
    },          
]

</script>

<template>

    

    <div id="listBox"> 
        <div v-for="value in listData" class="container">
            <Post></Post>
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

#wrapper {
    width: 100%;
    height: 100%;

    border-left: 0px solid #b8b7b7;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    overflow: auto;
}

#listBox {
    width: 100%;
    height: 100%;
    
    overflow-y: auto;
    overflow-x: hidden;
}

</style>
