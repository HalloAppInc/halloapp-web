<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import { useColorStore } from '../../stores/colorStore'

import { useHAMediaUpload } from '../../composables/haMediaUpload'

import InputBox from './InputBox.vue'
import Composer from './Composer.vue'

const colorStore = useColorStore()

const { saveMetaDataFromImage, saveMetaDataFromVideo } = useHAMediaUpload()

const props = defineProps(['replyQuoteIdx'])

const uploadFiles: any = ref([])

const selectAndUploadfile = ref(<HTMLElement | null>(null))
const chatBox = ref(<HTMLElement | null>(null))

const showAttachMenu = ref(false)
const showComposer = ref({'value' : false})

const chatBoxHeight = ref(0)

const headerColor = computed(() => {
    return colorStore.header
})
const iconColor = computed(() => {
    return colorStore.icon
})
const hoverColor = computed(() => {
    return colorStore.hover
})
const shadowColor = computed(() => {
    return colorStore.shadow
})
const hoverTextColor = computed(() => {
    return colorStore.hoverText
})
const hoverTextBackgroundColor = computed(() => {
    return colorStore.hoverTextBackground
})

function openAttachMenu() {
    showAttachMenu.value = !showAttachMenu.value
    // set menu position
    if (chatBox.value) {
        chatBoxHeight.value = chatBox.value.clientHeight
    }
}

function onFilePicked(event: any) {
    // make upload file array empty
    uploadFiles.value.splice(0, uploadFiles.value.length)
    const files = event.target.files
    const numOfFile = files.length
    for (let i = 0; i < numOfFile; i++) {
        let file = files[i]
        // if select at least one file
        if (file) {
            let type = file.type.toString().includes('video') ? 'video' : 'image'
            if (i == numOfFile - 1) {
                // open composer
                showComposer.value.value = true
                // close attach menu
                showAttachMenu.value = false
            }
            if (type == 'image') {
                saveMetaDataFromImage(file, uploadFiles.value)
            }
            else {
                saveMetaDataFromVideo(file, uploadFiles.value)
            }
        }
    }
    event.target.value = ''
}

function closeMenu() {
    showAttachMenu.value = false
}

onMounted(() => {
    document.addEventListener("click", closeMenu)
})

onUnmounted(() => {
    document.removeEventListener("click", closeMenu)
})
</script>

<template>

    <!-- attach menu -->
    <transition name='attach'>
        <div class='veriticalMenuContainer' v-show='showAttachMenu'>

            <!-- upload documents -->
            <!-- <div class='container'>
                <input type='file' ref='selectAndUploadfile' accept='*' @change='onFilePicked'
                    style='display: none' />
                <div class='iconContainer' @mousedown='selectAndUploadfile?.click'>
                    <div class='iconShadowAttachPhoto'>
                        <font-awesome-icon :icon="['fas', 'file']" size='lg' />
                    </div>
                </div>
                <div class='hoverTextContainer'>
                    <div class='textContainer'>
                        Documents
                    </div>
                </div>
            </div> -->

            <!-- upload video and photo -->
            <div class='container'>
                <!-- select file -->
                <input type='file' multiple ref='selectAndUploadfile' accept='image/*, video/*' @change='onFilePicked'
                    style='display: none' @click.stop/>
                <!-- icon -->
                <div class='iconContainer' @mousedown='selectAndUploadfile?.click()' @click.stop>
                    <div class='iconShadowAttachPhoto'>
                        <font-awesome-icon :icon="['fas', 'image']" size='lg' />
                    </div>
                </div>
                <!-- hover text -->
                <div class='hoverTextContainer'>
                    <div class='textContainer'>
                        Photos & Videos
                    </div>
                </div>
            </div>

        </div>
    </transition>

    <div class='chatBoxTray' ref='chatBox'>

        <!-- <div class='iconContainer'>
            <div class='iconShadow' :class="{ 'showIconShadow': showAttachMenu == true }">
                <font-awesome-icon :icon="['fas', 'face-smile']" size='lg' />
            </div>
        </div> -->

        <div class='iconContainer' @mousedown='openAttachMenu' @click.stop>
            <div class='iconShadow' :class="{ 'showIconShadow': showAttachMenu == true }">
                <font-awesome-icon :icon="['fas', 'paperclip']" size='lg' />
            </div>
        </div>

        <InputBox
            :uploadFiles='""'
            :alwaysShowSendButton='false'
            :replyQuoteIdx='props.replyQuoteIdx' 
            :init='showComposer.value'/>

        <!-- <div class='iconContainer'>
            <div class='iconShadow' :class="{ 'showIconShadow': showAttachMenu == true }">
                <font-awesome-icon :icon="['fas', 'microphone']" size='lg' />
            </div>
        </div> -->

    </div>

    <!-- composer -->
    <Composer 
        :showComposer='showComposer' 
        :uploadFiles='uploadFiles'
        :replyQuoteIdx='replyQuoteIdx' />
        
</template>

<style scoped>
.attach-enter-active,
.attach-leave-active {
    transition: all 0.5s ease
}

.attach-enter-from,
.attach-leave-to {
    transform: scale(0.1);
    opacity: 0;
}

.container {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.iconContainer {
    margin: 5px;
    color: v-bind(iconColor);
}

.iconContainer:hover {
    display: flex;
    cursor: pointer;
}

.chatBoxTray {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    background-color: v-bind(headerColor);
    padding: 2px 5px 2px 5px;
}

.veriticalMenuContainer {
    position: fixed;
    bottom: v-bind(chatBoxHeight + 'px');
    margin: 10px 10px;

    display: flex;
    flex-direction: column;

    z-index: 2;
}

.iconShadow {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50%;
}

.iconShadow:hover {
    background-color: v-bind(hoverColor);
}

.showIconShadow {
    background-color: v-bind(hoverColor);
}

.iconShadowAttachPhoto {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50%;
    box-shadow: -2px 2px 8px v-bind(shadowColor);
    background-color: #E6E6FA;
    /* animation: colorChange 60s infinite; */
}

.hoverTextContainer {
    background-color: v-bind(hoverTextBackgroundColor);
    border-radius: 15px;
    display: none;
    padding: 5px 10px;
    user-select: none;
}

.iconContainer:hover+.hoverTextContainer {
    display: flex;
}

.textContainer {
    font-size: small;
    color: v-bind(hoverTextColor);
}

/* @keyframes colorChange {
    0% {
        background: #7AD8F5;
        color: white;
    }

    20% {
        background: #9342A6;
        color: white;
    }

    40% {
        background: #AA1A13;
        color: white;
    }

    60% {
        background: #FECF87;
    }

    61% {
        color: #333;
    }

    80% {
        background: #AEE77E;
    }

    81% {
        color: white;
    }

    100% {
        background: #7AD8F5;
        color: white;
    }
} */
</style>