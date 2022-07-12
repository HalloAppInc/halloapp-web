<script setup lang="ts">
const props = defineProps(['mediaList'])

const numberOfMedia = props.mediaList.length
</script>

<template>

    <div class='containerOneMedia' v-if='numberOfMedia == 1'>
        <div class='imgBigContainer' :height='mediaList[0].hieght' >
            <img :src='mediaList[0].url' :width='mediaList[0].width' :height='mediaList[0].hieght' />
        </div>
    </div>

    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 2'>
        <div class='imgVerticalRectangleContainer'>
            <img :src='mediaList[0].url' :height='mediaList[0].hieght' :width='mediaList[0].width' />
        </div>
        <div class='imgVerticalRectangleContainer lastElementInLine'>
            <img :src='mediaList[1].url' :height='mediaList[1].hieght' :width='mediaList[1].width' />
        </div>
    </div>

    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia == 3'>
        <div class='imgSquareContainer'>
            <img :src='mediaList[0].url' :width='mediaList[0].width' :height='mediaList[0].hieght' />
        </div>
        <div class='imgSquareContainer imgSquareContainerLastElement'>
            <img :src='mediaList[1].url' :width='mediaList[1].width' :height='mediaList[1].hieght' />
        </div>
        <div class='imgHorizontalRectangleContainer'>
            <img :src='mediaList[2].url' :width='mediaList[2].width' :height='mediaList[2].hieght' />
        </div>
    </div>

    <div class='containerMoreThanOneMedia' v-else-if='numberOfMedia >= 4'>
        <div class='imgSquareContainer'>
            <img :src='mediaList[0].url' :width='mediaList[0].width' :height='mediaList[0].hieght' />
        </div>
        <div class='imgSquareContainer imgSquareContainerLastElement'>
            <img :src='mediaList[1].url' :width='mediaList[1].width' :height='mediaList[1].hieght' />
        </div>
        <div class='imgSquareContainer'>
            <img :src='mediaList[2].url' :width='mediaList[2].width' :height='mediaList[2].hieght' />
        </div>
        <div v-if='numberOfMedia == 4' class='imgSquareContainer imgSquareContainerLastElement'>
            <img :src='mediaList[3].url' :width='mediaList[3].width' :height='mediaList[3].hieght' />
        </div>
        <!-- if more than 4 -->
        <div v-else-if='numberOfMedia > 4'>
            <div class='imgSquareContainer imgSquareContainerLastElement'>
                <img class='blurImg' :src='mediaList[3].url' :width='mediaList[3].width'
                    :height='mediaList[3].hieght' />
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