<script setup lang="ts">
import { ref, computed } from 'vue'

import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

import InputBox from './InputBox.vue'

const mainStore = useMainStore()
const colorStore = useColorStore()

const props = defineProps(['uploadFiles', 'messageList', 'contactList'])

const selectAndUploadfile = ref(<HTMLElement | null>(null))
const chatBox = ref(<HTMLElement | null>(null))

const showAttachMenu = ref(false)

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

function openAttachMenu() {
    showAttachMenu.value = !showAttachMenu.value
    // set menu position
    if (chatBox.value) {
        chatBoxHeight.value = chatBox.value.clientHeight
    }
}

function onFilePicked(e: any) {
    // make upload file array empty
    props.uploadFiles.splice(0, props.uploadFiles.length)
    const files = e.target.files
    for (let i = 0; i < files.length; i++) {
        let file = files[i]
        // if select at least one file
        if (file) {
            let img = new Image()
            img.onload = function () {
                props.uploadFiles.push({
                        'file': file,
                        'width': img.width,
                        'height': img.height
                    })
                // goto composer after get width and height
                mainStore.gotoChatPage('composer')
            }
            img.src = URL.createObjectURL(file)
        }
    }
}
</script>

<template>

    <!-- attach menu -->
    <transition name='attach'>
        <div class='veriticalMenuContainer' v-if='showAttachMenu'>
            <!-- upload file -->
            <input type='file' ref='selectAndUploadfile' accept='image/*' @change='onFilePicked'
                style='display: none' />
            <!-- icon -->
            <div class='iconContainer' @mousedown='selectAndUploadfile?.click'>
                <div class='iconShadowAttachPhoto'>
                    <font-awesome-icon :icon="['fas', 'image']" size='lg' />
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
        <div class='iconContainer' tabindex='0' @click='openAttachMenu' @focusout='showAttachMenu = false'>
            <div class='iconShadow' :class="{ 'showIconShadow': showAttachMenu == true }">
                <font-awesome-icon :icon="['fas', 'paperclip']" size='lg' />
            </div>
        </div>
        <!-- uploadfile = "" does not attachment heren -->
        <InputBox :message-list='props.messageList' :contact-list='props.contactList' :upload-files='""' />
        <!-- <div class='iconContainer'>
            <div class='iconShadow' :class="{ 'showIconShadow': showAttachMenu == true }">
                <font-awesome-icon :icon="['fas', 'microphone']" size='lg' />
            </div>
        </div> -->
    </div>

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


.iconContainer {
    margin: 5px;
    color: v-bind(iconColor);
}

.iconContainer:hover {
    cursor: pointer;
}

.chatBoxTray {
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: v-bind(headerColor);
}

.veriticalMenuContainer {
    position: fixed;
    bottom: v-bind(chatBoxHeight + 'px');
    margin: 10px 10px;
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