<script setup lang="ts">
import { ref, computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

const colorStore = useColorStore()
const mainStore = useMainStore()

const props = defineProps(['selectMediaUrl','messageList'])

// delect media's idx in mediaUrlList
const selectMediaIdx = ref(-1)

const mediaUrlList = computed(() => {
    const result = []
    for (let i = 0; i < props.messageList.length; i++) {
        // find media from message list and build a new array for media
        if (props.messageList[i].media && props.messageList[i].media != '') {
            result.push(props.messageList[i].media)
            if (props.selectMediaUrl == props.messageList[i].media) {
                selectMediaIdx.value = result.length - 1 
            }
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
</script>

<template>

    <div id='mask' v-if='mainStore.chatPage == "media"' @click='mainStore.gotoChatPage("")'>
        <div id='wrapper'>
            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click="mainStore.gotoChatPage('chat')">
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
                    </div>
                </div>
            </div>

            <!-- tool box -->
            <!-- <div id='header'>
                <div class='iconContainer'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'face-smile']" size='lg' />
                    </div>
                </div>
            </div> -->

            <!-- image box: show the image -->
            <div id='content'>
                <div class='imgContainer'>
                    <img :src='mediaUrlList[selectMediaIdx]'/>
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
</style>