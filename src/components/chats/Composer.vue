<script setup lang="ts">
import { ref, computed, watch, ComputedRef } from 'vue'

import { useColorStore } from '../../stores/colorStore'

import { useHAMediaUpload } from '../../composables/haMediaUpload'
import { useHAMediaResize } from '../../composables/haMediaResize'
import { useHADatabase } from '../../composables/haDb'

import InputBox from './InputBox.vue'
import hal from '../../common/halogger'

const colorStore = useColorStore()

const { notifyWhenChanged } = useHADatabase()
const { saveMetaDataFromImage, saveMetaDataFromVideo, uploadAndDownLoad } = useHAMediaUpload()
const { setPreviewMediaSizes } = useHAMediaResize()

const props = defineProps(['showComposer', 'uploadFiles', 'replyQuoteIdx'])

const attachMediaList = ref(<any>[])

const testImage = ref()
const testVideo = ref()
const addUploadMedia = ref()

const selectMediaIdx = ref(0)

const mediaUrlList: ComputedRef = computed(() => {
    const result = []
    for (let i = 0; i < props.uploadFiles.length; i++) {
        let media = props.uploadFiles[i]
        let res = setPreviewMediaSizes(media)
        result.push({
            'url': media.url,
            'type': props.uploadFiles[i].type,
            'width': res?.mediaItemWidth,
            'height': res?.mediaItemHeight,
            'previewUrl': media.previewUrl
        })
    }
    return result
})

const init = ref(false)

const isReady = computed(() => {
    if (mediaUrlList.value[selectMediaIdx.value]) {
        if (init.value == false) {
            init.value = true
        }
        return true
    }
    else {
        return false
    }
})


function listener(type: string) {
    if (type == 'create' && props.showComposer.value) {
        hal.log('Composer/notifyWhenChanged/' + type)
        closeComposer()
    }
}

notifyWhenChanged(listener)

const backgroundColor = computed(() => {
    return colorStore.background
})
const shadowColor = computed(() => {
    return colorStore.shadow
})
const iconColor = computed(() => {
    return colorStore.icon
})

// To test upload and download, set openTest = true
const openTest = false

// close composer when press esc
document.addEventListener('keyup', (event) => {
    if (event.keyCode == 27) {
        closeComposer()
    }
})

function testUploadAndDownload(file: any) {
    if (file) {
        uploadAndDownLoad(file, attachMediaList.value)
    }
}

const numOfFile = computed(() => {
    return attachMediaList.value.length
})

watch(numOfFile, (newVal, oldVal) => {
    const newUrl = attachMediaList.value[attachMediaList.value.length - 1]
    if (testImage.value) {
        testImage.value.src = newUrl
    }
    if (testVideo.value) {
        testVideo.value.src = newUrl
    }
    hal.log('Composer/testUploadAndDownload/recevice new media, ' + 
        attachMediaList.value[attachMediaList.value.length - 1] 
        + 'number of total = ' + newVal)
})

function onFilePicked(event: any) {
    const files = event.target.files
    const numOfFileOld = mediaUrlList.value.length
    const numOfFileAdd = files.length
    for (let i = 0; i < numOfFileAdd; i++) {
        let file = files[i]
        // if select at least one file
        if (file) {
            let type = file.type.toString().includes('video') ? 'video' : 'image'
            if (i == 0) {
                selectMediaIdx.value = numOfFileOld
            }
            if (type == 'image') {
                saveMetaDataFromImage(file, props.uploadFiles)
            }
            else {
                saveMetaDataFromVideo(file, props.uploadFiles)
            }
        }
    }
    // reset select to allow second use of same media
    event.target.value = ''
}

function openBigImg(event: any, idx: number) {
    if (event.target.nodeName == 'IMG') {
        selectMediaIdx.value = idx
        if (mediaUrlList.value[selectMediaIdx.value].type == 'video') {
            let targetElement = document.getElementById('videoComposer') as HTMLVideoElement
            targetElement.src = mediaUrlList.value[selectMediaIdx.value].url
        }
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
    init.value = false
    props.showComposer.value = false
    props.uploadFiles.splice(0, props.uploadFiles.length)
}
</script>

<template>

    <div class='mask' v-if='showComposer.value' >
        <div class='wrapper' v-if='isReady || init' >

            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click='closeComposer'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'xmark']" size='xl' />
                    </div>
                </div>
            </div>

            <!-- tool box: edit uploaded photo -->
            <div class='header'>
                <div class='iconContainer'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'face-smile']" size='xl' />
                    </div>
                </div>

                <!-- only for testing! -->
                <div v-if='openTest' class='iconContainer'
                    @click='testUploadAndDownload(props.uploadFiles[selectMediaIdx])'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'hammer']" size='xl' />
                    </div>
                </div>
            </div>

            <!-- image box: show the image -->
            <div class='content'>

                <div v-if='isReady'>
                    <div v-if='mediaUrlList[selectMediaIdx].type == "image"' class='imgBigContainer'>
                        <img class='imgBig' :src='mediaUrlList[selectMediaIdx].url' />
                        <!-- only for testing! -->
                        <img v-if='openTest' class='imgBig' ref='testImage' />
                    </div>

                    <div v-show='mediaUrlList[selectMediaIdx].type == "video"' class='videoContainer'>
                        <video controls :src='props.uploadFiles[selectMediaIdx].url' id='videoComposer'
                            preload='metadata' playsinline controlslist=''>
                            <source :src='props.uploadFiles[selectMediaIdx].url'>
                        </video>
                        <!-- only for testing! -->
                        <video v-if='openTest' controls ref='testVideo' preload='metadata' playsinline controlslist=''>
                        </video>
                    </div>
                </div>

                <div v-else>
                    <div class='loaderContainer'>
                        <div class='loader'></div>
                    </div>
                </div>

            </div>

            <!-- input box: add caption -->
            <div class='footer'>

                <div class='chatBoxTray' ref='chatBox'>
                    <InputBox 
                        :uploadFiles='uploadFiles'
                        :alwaysShowSendButton='true' 
                        :replyQuoteIdx='replyQuoteIdx' />
                </div>

                <!-- media preview and add more media -->
                <div class='mediaTray'>

                    <div class='smallPreviewContainer'>
                        <div v-for='(value, idx) in mediaUrlList' @click='openBigImg($event, idx)'
                            :class="{ 'squareContainer': true, 'selected': idx == selectMediaIdx }">

                            <div class='imgSmallContainer'>
                                <img class='imgSmall' :width='value.width' :height='value.height'
                                    :src='value.previewUrl' />
                            </div>

                            <!-- close toggler -->
                            <div class='menuToggler' @click='deleteMedia(idx)'>
                                <div class='togglerIconContainer'>
                                    <font-awesome-icon :icon="['fas', 'xmark']" size='xs' />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class='addMoreIconContainer'>
                        <!-- upload file -->
                        <input type='file' multiple ref='addUploadMedia' accept='image/*, video/*'
                            @change='onFilePicked($event)' style='display: none' />
                        <div class='iconContainer' @click='addUploadMedia?.click'>
                            <font-awesome-icon :icon="['fas', 'plus']" size='lg' />
                        </div>
                    </div>

                </div>
            </div>
         </div>

        <!-- loader -->
         <div class='wrapper' v-else>

            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click='closeComposer'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
                    </div>
                </div>
            </div>

            <div class='loaderContainer'>
                <div class='loader'></div>
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
    background-color: v-bind(backgroundColor);
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
    width: 100vw;
    height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.footer {
    bottom: 0;
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

.videoContainer {
    width: fit-content;
    height: 70vh;
}

video {
    max-width: 70vw;
    max-height: 70vh;
    background-color: v-bind(backgroundColor);
    box-shadow: 0px 0px 20px 2px v-bind(shadowColor);
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

    outline: 1px solid gainsboro;
}

.squareContainer:hover {
    cursor: pointer;
}

.menuToggler {
    z-index: 3;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 15px;
    height: 15px;
    top: -58px;
    left: 25px;
    border-radius: 50%;
    background-color: gray;
}

.togglerIconContainer {
    color: white;
}

.imgSmallContainer {
    border-radius: 5px;
    width: 50px;
    height: 50px;
    overflow: hidden;
}

.imgSmall {

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

.loader {
    border: 15px solid #f3f3f3;
    border-radius: 50%;
    border-top: 15px solid #007AFF;
    width: 100px;
    height: 100px;
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

.loaderContainer {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>