<script setup lang="ts">
import { ref, computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

import { useHAMediaResize } from '../../composables/haMediaResize'

const colorStore = useColorStore()
const mainStore = useMainStore()

const { setPreviewMediaSizes } = useHAMediaResize()

const props = defineProps(['selectMessageIdx', 'selectMediaUrl', 'messageList'])

// delect media's idx in mediaUrlList
const selectMediaIdx = ref()

const mediaUrlList = computed(() => {
    const result = []
    let list = props.messageList[props.selectMessageIdx]
    // find media from message list and build a new array for media
    for (let i = 0; i < list.media.length; i++) {
        let media = list.media[i]
        let res = setPreviewMediaSizes(media)
        result.push({
                'url': list.media[i].url,
                'width': res?.mediaItemWidth,
                'height': res?.mediaItemHeight
            })
        // find the one that was clicked by user
        if (props.selectMediaUrl == list.media[i].url) {
            selectMediaIdx.value = result.length - 1
        }
    }
    return result
})

const backgroundColor = computed(() => {
    return colorStore.background
})
const wraperColor = computed(() => {
    return colorStore.wraper
})
const shadowColor = computed(() => {
    return colorStore.shadow
})
const iconColor = computed(() => {
    return colorStore.icon
})
const hoverColor = computed(() => {
    return colorStore.hover
})

function lastMedia() {
    if (selectMediaIdx.value > 0) {
        selectMediaIdx.value -= 1
    }
}

function nextMedia() {
    if (selectMediaIdx.value < mediaUrlList.value.length - 1) {
        selectMediaIdx.value += 1
    }
}

function openBigImg(idx: number) {
    selectMediaIdx.value = idx
}
</script>

<template>

    <div id='mask' v-if='mainStore.chatPage == "media"'>
        <div id='wrapper'>
            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click='mainStore.gotoChatPage("")'>
                    <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
                </div>
            </div>

            <!-- tool box -->
            <div id='header'>
                <div class='iconContainer'>
                    <font-awesome-icon :icon="['fas', 'face-smile']" size='lg' />
                </div>
            </div>

            <!-- image box: show the image -->
            <div id='content'>
                <div class='leftArrowIconContainer'>
                    <div class='iconContainer' :class='{ iconContainerForbidden: selectMediaIdx == 0 }'
                        @mousedown='lastMedia()'>
                        <div class='iconShadow' :class='{ iconShadowFrbidden: selectMediaIdx == 0 }'>
                            <font-awesome-icon :icon="['fas', 'angle-left']" size='lg' />
                        </div>
                    </div>
                </div>

                <div class='imgContainer'>
                    <img :src='mediaUrlList[selectMediaIdx].url' />
                </div>

                <div class='rightArrowIconContainer'>
                    <div class='iconContainer'
                        :class='{ iconContainerForbidden: selectMediaIdx == mediaUrlList.length - 1 }'
                        @mousedown='nextMedia()'>
                        <div class='iconShadow'
                            :class='{ iconShadowFrbidden: selectMediaIdx == mediaUrlList.length - 1 }'>
                            <font-awesome-icon :icon="['fas', 'angle-right']" size='lg' />
                        </div>
                    </div>
                </div>
            </div>

            <div id='footer'>
                <!-- media preview and add more media -->
                <div class='mediaTray'>
                    <div class='smallPreviewContainer'>
                        <div class='squareContainer' v-for='(value, idx) in mediaUrlList'
                            @click='openBigImg(idx)'
                            :class="{ 'selected': idx == selectMediaIdx }">
                            <div class='imgSmallContainer'>
                                <img class='imgSmall' :width='value.width' :height='value.height' :src='value.url' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<style scoped>
#mask {
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: v-bind(wraperColor);
    display: table;
}

#wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    background-color: v-bind(wraperColor);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

#header {
    flex: 1 1 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

#content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#footer {
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.imgContainer {
    width: fit-content;
    height: fit-content;
}

img {
    max-width: 70vw;
    max-height: 70vh;
    background-color: v-bind(backgroundColor);
    box-shadow: 0px 0px 20px 2px v-bind(shadowColor);
}

#footer {
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.chatBoxTray {
    width: 500px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: row;
}

.leftArrowIconContainer {
    position: fixed;
    left: 0;
}

.rightArrowIconContainer {
    position: fixed;
    right: 0;
}

.closeIconContainer {
    position: fixed;
    top: 0px;
    left: 0px;
}

.iconContainer {
    margin: 20px;
    color: v-bind(iconColor);
}

.iconContainer:hover {
    cursor: pointer;
}

.iconShadow {
    width: 40px;
    height: 40px;
    background-color: #C0C0C0;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50%;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
}

.iconShadow:active {
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
}

.iconShadowFrbidden {
    background-color: #E5E4E2;
}

.iconContainerForbidden {
    color: #C0C0C0;
}

.iconContainerForbidden:active {
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
}

.iconContainerForbidden:hover {
    cursor: default;
}

.mediaTray {
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.smallPreviewContainer {
    width: fit-content;
    height: 50px;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.squareContainer {
    z-index: 2;
    width: 50px;
    height: 50px;
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;

    border: 1px solid gainsboro;
}

.squareContainer:hover {
    cursor: pointer;
}

.imgSmallContainer {
    z-index: 1;

    width: 50px;
    height: 50px;
    overflow: hidden;
}

.imgSmall {
    z-index: 0;

    overflow: hidden;
}

.selected {
    border: 3px solid #1E90FF;
}
</style>