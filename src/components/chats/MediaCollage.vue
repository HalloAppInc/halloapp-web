<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps(['mediaList'])

const numberOfMedia = props.mediaList.length

const firstMedia = computed(() => {
    return props.mediaList[0] ? props.mediaList[0] : null
})
const secondMedia = computed(() => {
    return props.mediaList[1] ? props.mediaList[1] : null
})
const thirdMedia = computed(() => {
    return props.mediaList[2] ? props.mediaList[2] : null
})
const fourthMedia = computed(() => {
    return props.mediaList[3] ? props.mediaList[3] : null
})
</script>

<template>

    <div class='containerOneMedia' v-if='numberOfMedia == 1'>

        <div class='loaderContainer' v-if='!firstMedia.sendToAWS'>
            <div class='loader'></div>
        </div>

        <div class='imgBigContainer' :class='{ "blur": !firstMedia.sendToAWS }' @click="$emit('openMedia', mediaList, 0)">
            <img :src='firstMedia.previewUrl' :width='firstMedia.width' :height='firstMedia.hieght' />
            <div class='iconContainer' v-if='firstMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>
        </div>

    </div>



    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 2'>

        <div class='imgVerticalRectangleContainer' @click="$emit('openMedia', mediaList, 0)">

            <img :src='firstMedia.previewUrl' :height='firstMedia.hieght' :width='firstMedia.width' />
            <div class='iconContainer' v-if='firstMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgVerticalRectangleContainer lastElementInLine' @click="$emit('openMedia', mediaList, 1)">

            <img :src='secondMedia.previewUrl' :height='secondMedia.hieght' :width='secondMedia.width' />
            <div class='iconContainer' v-if='secondMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

    </div>



    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 3'>

        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0)">

            <img :src='firstMedia.previewUrl' :height='firstMedia.hieght' :width='firstMedia.width' />
            <div class='iconContainer' v-if='firstMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgSquareContainer imgSquareContainerLastElementInRow' @click="$emit('openMedia', mediaList, 1)">

            <img :src='secondMedia.previewUrl' :height='secondMedia.hieght' :width='secondMedia.width' />
            <div class='iconContainer' v-if='secondMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgHorizontalRectangleContainer' @click="$emit('openMedia', mediaList, 2)">

            <img :src='thirdMedia.previewUrl' :height='thirdMedia.hieght' :width='thirdMedia.width' />
            <div class='iconContainer' v-if='thirdMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

    </div>



    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia >= 4'>

        <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0)">

            <img :src='firstMedia.previewUrl' :height='firstMedia.hieght' :width='firstMedia.width' />
            <div class='iconContainer' v-if='firstMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgSquareContainer imgSquareContainerLastElementInRow' @click="$emit('openMedia', mediaList, 1)">

            <img :src='secondMedia.previewUrl' :height='secondMedia.hieght' :width='secondMedia.width' />
            <div class='iconContainer' v-if='secondMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <div class='imgSquareContainer imgSquareContainerLastElementInCol' @click="$emit('openMedia', mediaList, 2)">

            <img :src='thirdMedia.previewUrl' :height='thirdMedia.hieght' :width='thirdMedia.width' />
            <div class='iconContainer' v-if='thirdMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <!-- if 4 media -->
        <div v-if='numberOfMedia == 4' class='imgSquareContainer imgSquareContainerLastElementInRow imgSquareContainerLastElementInCol'
            @click="$emit('openMedia', mediaList, 3)">

            <img :src='fourthMedia.previewUrl' :height='fourthMedia.hieght' :width='fourthMedia.width' />
            <div class='iconContainer' v-if='fourthMedia.type == "video"'>
                <font-awesome-icon :icon="['fas', 'play']" size='2x' />
            </div>

        </div>

        <!-- if more than 4 -->
        <div v-else-if='numberOfMedia > 4' @click="$emit('openMedia', mediaList, 3)">
            <div class='imgSquareContainer imgSquareContainerLastElementInRow imgSquareContainerLastElementInCol'>

                <img class='blurImg' :src='fourthMedia.previewUrl' :height='fourthMedia.hieght' :width='fourthMedia.width' />
                <div class='iconContainer'>
                    <font-awesome-icon :icon="['fas', 'plus']" size='2x' />
                </div>

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

    position: relative;
}

.imgVerticalRectangleContainer {
    width: 150px;
    height: 300px;
    overflow: hidden;
    margin-right: 5px;
    border-radius: 5px;

    position: relative;
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

    position: relative;
}

.imgSquareContainerLastElementInRow {
    margin-right: 0px;
}

.imgSquareContainerLastElementInCol {
    margin-bottom: 0px;
}

.imgHorizontalRectangleContainer {
    width: 305px;
    height: 150px;
    overflow: hidden;
    border-radius: 5px;

    position: relative;
}

.blurImg {
    filter: blur(4px);
    overflow: hidden;
}

.iconContainer {
    position: absolute;
    width: fit-content;
    height: fit-content;
    left: 50%;
    bottom: 50%;

    transform: translate(-50%, 50%);

    color: gainsboro;
}

.blur {
    filter: blur(5px);
}

.loaderContainer {
    position: absolute;
    z-index: 1;
    left: 50%;
    bottom: 50%;
    width: fit-content;
    height: fit-content;
    transform: translate(-50%, 40%);

    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.loader {
    border: 10px solid #f3f3f3;
    border-radius: 50%;
    border-top: 10px solid gray;
    width: 80px;
    height: 80px;
    -webkit-animation: spin 2s linear infinite;
    /* Safari */
    animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>