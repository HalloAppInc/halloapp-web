<script setup lang="ts">

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

<div id="wrapper">

    <div id="content">


        <div v-for="value in listData" class="container">

            <!-- <MediaCarousel  
                :isMobile="isMobile"
                :isSafari="isSafari"
                :isAlbum="isAlbum"
                :album="album.media"
                :showPreviewImage="showPreviewImage"
                :previewImageSrc="previewImageSrc"
                :mediaBoxWidth="mediaBoxWidth"
                :mediaBoxHeight="mediaBoxHeight">
            </MediaCarousel> -->

        </div>


    </div>

</div>

</template>

<style scoped>

#wrapper {
    width: 100%;
    height: 100%;

    border-left: 1px solid #b8b7b7;

    background-color: white;

  
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

#header {
    flex: 0 0 50px;
    background-color: #f0f2f5;
    padding: 10px;
}

#content {
    flex: 1 1 auto;
    background-color: white;
}

</style>
