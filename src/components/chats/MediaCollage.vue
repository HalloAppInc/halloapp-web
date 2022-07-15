<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps(['mediaList'])

onMounted(() => {
    console.log('mounted!')
})

const firstMedia = ref(props.mediaList[0] ? props.mediaList[0] : null)
const secondMedia = ref(props.mediaList[1] ? props.mediaList[1] : null)
const thirdMedia = ref(props.mediaList[2] ? props.mediaList[2] : null)
const fourthMedia = ref(props.mediaList[3] ? props.mediaList[3] : null)

const numberOfMedia = props.mediaList.length
</script>

<template>

    <div class='containerOneMedia' v-if='numberOfMedia == 1'>
        <div class='imgBigContainer' :height='mediaList[0].hieght' @click="$emit('openMedia', mediaList, 0)">
            <img :src='firstMedia.url' :width='firstMedia.width' :height='firstMedia.hieght' />
        </div>
    </div>

    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 2'>
        <div class='imgVerticalRectangleContainer' @click="$emit('openMedia', mediaList, 0)">
            <img :src='firstMedia.url' :height='firstMedia.hieght' :width='firstMedia.width' />
        </div>
        <div class='imgVerticalRectangleContainer lastElementInLine' @click="$emit('openMedia', mediaList, 1)">
            <img :src='secondMedia.url' :height='secondMedia.hieght' :width='secondMedia.width' />
        </div>
    </div>

    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 3'>
        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0)">
            <img :src='firstMedia.url' :width='firstMedia.width' :height='firstMedia.hieght' />
        </div>
        <div class='imgSquareContainer imgSquareContainerLastElement' @click="$emit('openMedia', mediaList, 1)">
            <img :src='secondMedia.url' :width='secondMedia.width' :height='secondMedia.hieght' />
        </div>
        <div class='imgHorizontalRectangleContainer' @click="$emit('openMedia', mediaList, 2)">
            <img :src='thirdMedia.url' :width='thirdMedia.width' :height='thirdMedia.hieght' />
        </div>
    </div>

    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia >= 4'>
        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0)">
            <img :src='firstMedia.url' :width='firstMedia.width' :height='firstMedia.hieght' />
        </div>
        <div class='imgSquareContainer imgSquareContainerLastElement' @click="$emit('openMedia', mediaList, 1)">
            <img :src='secondMedia.url' :width='secondMedia.width' :height='secondMedia.hieght' />
        </div>
        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 2)">
            <img :src='thirdMedia.url' :width='thirdMedia.width' :height='thirdMedia.hieght' />
        </div>
        <div v-if='numberOfMedia == 4' class='imgSquareContainer imgSquareContainerLastElement' @click="$emit('openMedia', mediaList, 3)">
            <img :src='fourthMedia.url' :width='fourthMedia.width' :height='fourthMedia.hieght' />
        </div>
        <!-- if more than 4 -->
        <div v-else-if='numberOfMedia > 4' @click="$emit('openMedia', mediaList, 3)">
            <div class='imgSquareContainer imgSquareContainerLastElement'>
                <img class='blurImg' :src='fourthMedia.url' :width='fourthMedia.width'
                    :height='fourthMedia.hieght' />
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