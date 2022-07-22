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

            <img :src='firstMedia.preview' :width='firstMedia.width' :height='firstMedia.hieght' />
            <div class='iconContainerBig' v-if='firstMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

    </div>



    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 2'>

        <div class='imgVerticalRectangleContainer' @click="$emit('openMedia', mediaList, 0)">

            <img :src='firstMedia.preview' :height='firstMedia.hieght' :width='firstMedia.width' />
            <div class='iconContainerVerticalRectangle' v-if='firstMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgVerticalRectangleContainer lastElementInLine' @click="$emit('openMedia', mediaList, 1)">

            <img :src='secondMedia.preview' :height='secondMedia.hieght' :width='secondMedia.width' />
            <div class='iconContainerVerticalRectangle' v-if='secondMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

    </div>



    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 3'>

        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0)">

            <img :src='firstMedia.preview' :height='firstMedia.hieght' :width='firstMedia.width' />
            <div class='iconContainerSquare' v-if='firstMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgSquareContainer imgSquareContainerLastElement' @click="$emit('openMedia', mediaList, 1)">

            <img :src='secondMedia.preview' :height='secondMedia.hieght' :width='secondMedia.width' />
            <div class='iconContainerSquare' v-if='secondMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgHorizontalRectangleContainer' @click="$emit('openMedia', mediaList, 2)">

            <img :src='thirdMedia.preview' :height='thirdMedia.hieght' :width='thirdMedia.width' />
            <div class='iconContainerHorizontalRectangle' v-if='thirdMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

    </div>



    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia >= 4'>

        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0)">

            <img :src='firstMedia.preview' :height='firstMedia.hieght' :width='firstMedia.width' />
            <div class='iconContainerSquare' v-if='firstMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgSquareContainer imgSquareContainerLastElement' @click="$emit('openMedia', mediaList, 1)">

            <img :src='secondMedia.preview' :height='secondMedia.hieght' :width='secondMedia.width' />
            <div class='iconContainerSquare' v-if='secondMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 2)">

            <img :src='thirdMedia.preview' :height='thirdMedia.hieght' :width='thirdMedia.width' />
            <div class='iconContainerSquare' v-if='thirdMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <!-- if 4 media -->
        <div v-if='numberOfMedia == 4' class='imgSquareContainer imgSquareContainerLastElement'
            @click="$emit('openMedia', mediaList, 3)">

            <img :src='fourthMedia.preview' :height='fourthMedia.hieght' :width='fourthMedia.width' />
            <div class='iconContainerSquare' v-if='fourthMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <!-- if more than 4 -->
        <div v-else-if='numberOfMedia > 4' @click="$emit('openMedia', mediaList, 3)">
            <div class='imgSquareContainer imgSquareContainerLastElement'>

                <img class='blurImg' :src='fourthMedia.preview' :height='fourthMedia.hieght' :width='fourthMedia.width' />

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

.iconContainerBig {
    position: relative;
    width: 20px;
    height: 20px;
    top: -160px;
    left: 150px;

    color: gainsboro;
}

.iconContainerVerticalRectangle {
    position: relative;
    width: 20px;
    height: 20px;
    top: -160px;
    left: 75px;

    color: gainsboro;
}

.iconContainerSquare {
    position: relative;
    width: 20px;
    height: 20px;
    top: -95px;
    left: 65px;

    color: gainsboro;
}

.iconContainerHorizontalRectangle {
    position: relative;
    width: 20px;
    height: 20px;
    top: -210px;
    left: 150px;

    color: gainsboro;
}

.iconContainer {
    position: relative;
    width: 20px;
    height: 20px;
    top: -95px;
    left: 65px;

    color: gainsboro;
}
</style>