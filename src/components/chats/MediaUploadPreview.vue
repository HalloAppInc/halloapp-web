<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

import { useHAMediaUpload } from '../../composables/haMediaUpload'

import InputBox from './InputBox.vue'
import { arrayBuffer } from 'stream/consumers'

const colorStore = useColorStore()
const mainStore = useMainStore()

const { uploadAndDownLoad } = useHAMediaUpload()

const props = defineProps(['uploadFiles', 'messageList', 'contactList'])

const attachMediaList = ref(<any>[])

const test = ref()

const messageNumber = computed(() => {
    return props.messageList.length
})

const mediaUrlList = computed(() => {
    const result = []
    for (let i = 0; i < props.uploadFiles.length; i++) {
        result.push(URL.createObjectURL(props.uploadFiles[i]))
    }
    return result
})

// if message is sent, close preview
watch(messageNumber, (newVal, oldVal) => {
    mainStore.gotoChatPage('')
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

async function testUploadAndDownload(file: any) {
    await uploadAndDownLoad(file, attachMediaList.value)
    // wait for uploadAndDownLoad
    setTimeout(() => {
        // console.log(attachMediaList.value)
        test.value.src = attachMediaList.value[attachMediaList.value.length - 1]
    }, 5000)
}
</script>

<template>

    <div id='mask' v-if='mainStore.chatPage == "preview"'>
        <div id='wrapper'>
            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click="mainStore.gotoChatPage('chat')">
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
                    </div>
                </div>
            </div>

            <!-- tool box: edit uploaded photo -->
            <div id='header'>
                <!-- test upload and download -->
                <div class='iconContainer'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'face-smile']" size='lg' />
                    </div>
                </div>

                <div class='button' @click='testUploadAndDownload(props.uploadFiles[0])'> try upload and download </div>
            </div>

            <!-- image box: show the image -->
            <div id='content'>
                <div class='imgContainer'>
                    <img :src='mediaUrlList[0]' />
                    <img ref='test' />
                </div>
            </div>

            <!-- input box: add caption -->
            <div id='footer'>
                <div class='chatBoxTray' ref='chatBox'>
                    <InputBox :message-list='messageList' :contact-list='contactList' :upload-files='mediaUrlList[0]' />
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

img {
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

.button {
    margin: 10px 0px;
    width: 200px;
    height: 30px;
    background-color: azure;
    border: 1px solid aqua;
    border-radius: 10px;
    text-align: center;
}
</style>