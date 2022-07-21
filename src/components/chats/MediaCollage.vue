<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps(['mediaList'])

const numberOfMedia = props.mediaList.length

const firstMedia = ref(props.mediaList[0] ? props.mediaList[0] : null)
const secondMedia = ref(props.mediaList[1] ? props.mediaList[1] : null)
const thirdMedia = ref(props.mediaList[2] ? props.mediaList[2] : null)
const fourthMedia = ref(props.mediaList[3] ? props.mediaList[3] : null)
</script>

<template>

    <div class='containerOneMedia' v-if='numberOfMedia == 1'>

        <div class='imgBigContainer' @click="$emit('openMedia', mediaList, 0)">

            <img v-if='firstMedia.type == "image"' :src='firstMedia.url' 
                :width='firstMedia.width' :height='firstMedia.hieght' />

            <video v-else-if='firstMedia.type == "video"' :width='firstMedia.width' :height='firstMedia.height'>
                <source :src='firstMedia.url + "#t=0"'>
            </video>

        </div>

    </div>

    

    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 2'>

        <div class='imgVerticalRectangleContainer' @click="$emit('openMedia', mediaList, 0)">

            <img v-if='firstMedia.type == "image"' :src='firstMedia.url' 
                :height='firstMedia.hieght' :width='firstMedia.width' />

            <video v-else-if='firstMedia.type == "video"' :width='firstMedia.width' :height='firstMedia.height'>
                <source :src='firstMedia.url + "#t=0"'>
            </video>   

        </div>

        <div class='imgVerticalRectangleContainer lastElementInLine' @click="$emit('openMedia', mediaList, 1)">

            <img v-if='secondMedia.type == "image"' :src='secondMedia.url' 
                :height='secondMedia.hieght' :width='secondMedia.width' />

            <video v-else-if='secondMedia.type == "video"' :width='secondMedia.width' :height='secondMedia.height'>
                <source :src='secondMedia.url + "#t=0"'>
            </video>

        </div>

    </div>



    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 3'>

        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0)">

            <img v-if='firstMedia.type == "image"' :src='firstMedia.url' 
                :height='firstMedia.hieght' :width='firstMedia.width' />

            <video v-else-if='firstMedia.type == "video"' :width='firstMedia.width' :height='firstMedia.height'>
                <source :src='firstMedia.url + "#t=0"'>
            </video> 

        </div>

        <div class='imgSquareContainer imgSquareContainerLastElement' @click="$emit('openMedia', mediaList, 1)">

            <img v-if='secondMedia.type == "image"' :src='secondMedia.url' 
                :height='secondMedia.hieght' :width='secondMedia.width' />

            <video v-else-if='secondMedia.type == "video"' :width='secondMedia.width' :height='secondMedia.height'>
                <source :src='secondMedia.url + "#t=0"'>
            </video>

        </div>

        <div class='imgHorizontalRectangleContainer' @click="$emit('openMedia', mediaList, 2)">

            <img v-if='thirdMedia.type == "image"' :src='thirdMedia.url' 
                :height='thirdMedia.hieght' :width='thirdMedia.width' />

            <video v-else-if='thirdMedia.type == "video"' :width='thirdMedia.width'>
                <source :src='thirdMedia.url + "#t=0"'>
            </video>
            
        </div>

    </div>

    

    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia >= 4'>

        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0)">

           <img v-if='firstMedia.type == "image"' :src='firstMedia.url' 
                :height='firstMedia.hieght' :width='firstMedia.width' />

            <video v-else-if='firstMedia.type == "video"' :width='firstMedia.width' :height='firstMedia.height'>
                <source :src='firstMedia.url + "#t=0"'>
            </video>

        </div>

        <div class='imgSquareContainer imgSquareContainerLastElement' @click="$emit('openMedia', mediaList, 1)">

            <img v-if='secondMedia.type == "image"' :src='secondMedia.url' 
                :height='secondMedia.hieght' :width='secondMedia.width' />

            <video v-else-if='secondMedia.type == "video"' :width='secondMedia.width' :height='secondMedia.height'>
                <source :src='secondMedia.url + "#t=0"'>
            </video>

        </div>

        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 2)">

            <img v-if='thirdMedia.type == "image"' :src='thirdMedia.url' 
                :height='thirdMedia.hieght' :width='thirdMedia.width' />

            <video v-else-if='thirdMedia.type == "video"' :width='thirdMedia.width' :height='thirdMedia.height'>
                <source :src='thirdMedia.url + "#t=0"'>
            </video>

        </div>

        <!-- if 4 media -->
        <div v-if='numberOfMedia == 4' class='imgSquareContainer imgSquareContainerLastElement'
            @click="$emit('openMedia', mediaList, 3)">

            <img v-if='fourthMedia.type == "image"' :src='fourthMedia.url' 
                :height='fourthMedia.hieght' :width='fourthMedia.width' />

            <video v-else-if='fourthMedia.type == "video"' :width='fourthMedia.width' :height='fourthMedia.height'>
                <source :src='fourthMedia.url + "#t=0"'>
            </video>

        </div>

        <!-- if more than 4 -->
        <div v-else-if='numberOfMedia > 4' @click="$emit('openMedia', mediaList, 3)">
            <div class='imgSquareContainer imgSquareContainerLastElement'>

                <img v-if='fourthMedia.type == "image"' class='blurImg' :src='fourthMedia.url' 
                :height='fourthMedia.hieght' :width='fourthMedia.width' />

                <video v-else-if='fourthMedia.type == "video"' class='blurImg'
                    :width='fourthMedia.width' :height='fourthMedia.height'>
                    <source :src='fourthMedia.url + "#t=0"'>
                </video>

            </div>

            <div class='iconContainer'>
                <font-awesome-icon :icon="['fas', 'plus']" size='2x' />
            </div>

        </div>

    </div>

</template>

<style scoped>
.containerOneMedia {
    overflow: hidden;
    display: flex;
}

.containerMoreThanOneMedia {
    max-width: 305px;
    max-height: 310px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

img {
    overflow: hidden;
}

.imgBigContainer {
    width: 300px;
    height: 300px;
    border-radius: 5px;
    overflow: hidden;
}

.imgVerticalRectangleContainer {
    width: 150px;
    height: 300px;
    overflow: hidden;
    margin-right: 5px;
    border-radius: 5px;
}

.lastElementInLine {
    margin-right: 0px;
}

.lastElementInColumn {
    margin-bottom: 0px;
}

.imgSquareContainer {
    width: 150px;
    height: 150px;
    overflow: hidden;
    margin-right: 5px;
    border-radius: 5px;
    margin-bottom: 5px;
}

.imgSquareContainerLastElement {
    margin-right: 0px;
}

.imgHorizontalRectangleContainer {
    width: 305px;
    height: 150px;
    overflow: hidden;
    border-radius: 5px;
}

.blurImg {
    filter: blur(10px);
    -webkit-filter: blur(10px);
    -moz-filter: blur(10px);
    -o-filter: blur(10px);
    -ms-filter: blur(10px);
    overflow: hidden;
}

.iconContainer {
    position: relative;
    width: 20px;
    height: 20px;
    top: -100px;
    left: 60px;

    color: gainsboro;
}
</style>