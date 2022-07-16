<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import { useColorStore } from '../../stores/colorStore'

import { useHAMediaUpload } from '../../composables/haMediaUpload'
import { useHAMediaResize } from '../../composables/haMediaResize'

import InputBox from './InputBox.vue'

const colorStore = useColorStore()

const { uploadAndDownLoad } = useHAMediaUpload()
const { setPreviewMediaSizes } = useHAMediaResize()

const props = defineProps(['showComposer', 'uploadFiles', 'messageList', 'replyQuoteIdx', 'contactList'])

const attachMediaList = ref(<any>[])

const test = ref()
const addUploadMedia = ref()

const selectMediaIdx = ref(0)

const messageNumber = computed(() => {
    return props.messageList.length
})

const mediaUrlList = computed(() => {
    const result = []
    for (let i = 0; i < props.uploadFiles.length; i++) {
        let media = props.uploadFiles[i]
        let res = setPreviewMediaSizes(media)
        result.push({
            'url': media.url,
            'width': res?.mediaItemWidth,
            'height': res?.mediaItemHeight
            })
    }

    return result
})

// if message is sent, close preview
watch(messageNumber, (newVal, oldVal) => {
    closeComposer()
})

const shadowColor = computed(() => {
    return colorStore.shadow
})
const iconColor = computed(() => {
    return colorStore.icon
})

function testUploadAndDownload(file: any) {
    if (file) {
        uploadAndDownLoad(file, attachMediaList.value)
        // wait for uploadAndDownLoad
        setTimeout(() => {
            test.value.src = attachMediaList.value[attachMediaList.value.length - 1]
        }, 5000)
    }
}

function onFilePicked(event: any) {
    const files = event.target.files
    const numOfFileOld = mediaUrlList.value.length
    const numOfFileAdd = files.length
    for (let i = 0; i < numOfFileAdd ; i++) {
        let file = files[i]
        // if select at least one file
        if (file) {
            let img = new Image()
            img.onload = function () {
                props.uploadFiles.push({
                    'file': file,
                    'url': img.src,
                    'width': img.width,
                    'height': img.height
                    })
                if (i == numOfFileAdd - 1) {
                    selectMediaIdx.value = numOfFileOld + numOfFileAdd - 1 
                }
            }
            img.src = URL.createObjectURL(file)
        }
    }
    // reset select to allow second use of same media
    event.target.value = ''
}

function openBigImg(event: any, idx: number) {
    if (event.target.nodeName == 'IMG') {
        selectMediaIdx.value = idx
    }
    else {
        deleteMedia(idx)
    }
}

function deleteMedia(idx: number) {
    // delete the last one
    if (props.uploadFiles.length == 1) {
        closeComposer()
    }
    else {
        // if delete one is before select one
        if (idx <= selectMediaIdx.value && selectMediaIdx.value > 0) {
            selectMediaIdx.value -= 1
        }
        // remove this element
        props.uploadFiles.splice(idx, 1)
    }
}

function closeComposer() {
    selectMediaIdx.value = 0
    props.showComposer.value = false
    props.uploadFiles.splice(0, props.uploadFiles.length)
}
</script>

<template>

    <div class='mask' v-if='props.showComposer.value'>
        <div class='wrapper'>

            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click='closeComposer'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
                    </div>
                </div>
            </div>

            <!-- tool box: edit uploaded photo -->
            <div class='header'>
                <div class='iconContainer'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'face-smile']" size='lg' />
                    </div>
                </div>

                <!-- TODO: delete this one, only for testing! -->
                <div class='iconContainer' @click='testUploadAndDownload(props.uploadFiles[selectMediaIdx].file)'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'hammer']" size='lg' />
                    </div>
                </div>
            </div>

            <!-- image box: show the image -->
            <div class='content'>
                <div class='imgBigContainer'>
                    <img class='imgBig' :src='mediaUrlList[selectMediaIdx].url' />
                    <!-- TODO: delete this one, only for test -->
                    <img class='imgBig' ref='test' />
                </div>
            </div>

            <!-- input box: add caption -->
            <div class='footer'>

                <div class='chatBoxTray' ref='chatBox'>
                    <InputBox 
                        :message-list='messageList' 
                        :contact-list='contactList' 
                        :upload-files='uploadFiles'
                        :always-show-send-button='true'
                        :reply-quote-idx='replyQuoteIdx' />
                </div>

                <!-- media preview and add more media -->
                <div class='mediaTray'>
                    <div class='smallPreviewContainer'>
                        <div v-for='(value, idx) in mediaUrlList' @click='openBigImg($event, idx)'
                            :class="{ 'squareContainer': true, 'selected': idx == selectMediaIdx }" >

                            <div class='imgSmallContainer'>
                                <img class='imgSmall' :width='value.width' :height='value.height' :src='value.url' />
                            </div>

                            <!-- close toggler -->
                            <div class='menuToggler'>
                                <div class='togglerIconContainer'>
                                    <font-awesome-icon :icon="['fas', 'xmark']" size='xs' />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class='addMoreIconContainer'>
                        <!-- upload file -->
                        <input type='file' multiple ref='addUploadMedia' accept='image/*' @change='onFilePicked'
                            style='display: none' />
                        <div class='iconContainer' @click='addUploadMedia?.click'>
                            <font-awesome-icon :icon="['fas', 'plus']" size='lg' />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.mask {
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    display: table;
}

.wrapper {
    width: 100%;
    height: 100%;
    position: relative;

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

.header {
    flex: 1 1 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.imgBigContainer {
    width: fit-content;
    height: fit-content;
}

.imgBig {
    max-width: 70vw;
    max-height: 70vh;
    box-shadow: 0px 0px 20px 2px v-bind(shadowColor);
}

.footer {
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.chatBoxTray {
    width: 500px;
    display: flex;
    flex-direction: row;
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
    overflow-x: auto;
    padding-left: 5px;
    height: 56px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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

.squareContainer:hover .menuToggler {
    display: flex;
}

.menuToggler {
    z-index: 3;
    display: none;
    position: relative;
    width: 0;
    top: -45px;
    left: 10px;
    box-shadow: 2px -20px 50px 30px rgba(0, 0, 0, 0.5);
}

.togglerIconContainer {
    color: v-bind(iconColor);
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
    outline: 3px solid #1E90FF;
}

.addMoreIconContainer {
    width: 50px;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid gainsboro;
}
</style>