<script setup lang="ts">
import { ref, computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'

import { useMainStore } from '../../stores/mainStore'

import { useI18n } from 'vue-i18n'

import Popup from './Popup.vue'

const emits = defineEmits(["clearMessages"])

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const menu = ref<HTMLElement | null>(null)

const colorStore = useColorStore()

const mainStore = useMainStore()

const showChatSettings = ref(false)

const props = defineProps(['chatName', 'chatInformation','messageList'])

const hoverColor = computed(() => {
    return colorStore.hover
})

const lineColor = computed(() => {
    return colorStore.line
})

const textColor = computed(() => {
    return colorStore.text
})

const headerColor = computed(() => {
    return colorStore.header
})

const iconColor = computed(() => {
    return colorStore.icon
})

const backgroundColor = computed(() => {
    return colorStore.background
})
</script>

<template>

    <div id='chatHeader'>
        <div class='container'>
            <!-- show user profile photo and chat information -->
            <div class='avatarContainer'>
                <div class='avatar'></div>
            </div>
            <div class='content'>
                <div class='contentHeader'>
                    <div class='contentTitle'>
                        {{ props.chatName }}
                    </div>
                </div>
                <div class='contentBody'>
                    {{ props.chatInformation }}
                </div>
            </div>

            <!-- show chat menu -->
            <div class='verticalLine'> </div>
            <!-- <div class='iconContainer'>
                <div class='iconShadow'>
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" size='lg' />
                </div>
            </div> -->
            <div class='iconContainer' tabindex='0' @click='showChatSettings = !showChatSettings'
                @focusout='showChatSettings=false'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'angle-down']" size='lg' />
                    </div>
            </div>
        </div>
    </div>

    <!-- chat settings menu -->
    <div class='chatSettings' v-if='showChatSettings'>
        <div class='menu' ref='menu'>
            <div class='menuContainer'>
                <div class='textContainer'>
                    <div class='contentTextBody'>
                        {{ t('chatSettings.groupInformation') }}
                    </div>
                </div>
            </div>
            <div class='menuContainer' @mousedown="mainStore.gotoChatPage('settings')">
                <div class='textContainer'>
                    <div class='contentTextBody'>
                        {{ t('chatSettings.changeBackgroundColor') }}
                    </div>
                </div>
            </div>
            <div class='menuContainer'>
                <div class='textContainer textContainerlastElement' @mousedown="mainStore.gotoChatPage('clear')">
                    <div class='contentTextBody'>
                        {{ t('chatSettings.clearMessgae') }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Popup @clear-messages="$emit('clearMessages')"/>

</template>

<style scoped>
#chatHeader {
    overflow-y: auto;
    overflow-x: hidden;
    background-color: v-bind(headerColor);
    height: 100%;
}

.container {
    display: flex;
    flex-direction: horizontal;
    padding: 0px;
}

.avatarContainer {
    flex: 0 0 70px;
    padding: 5px 0px 5px 20px;
}

.avatar {
    width: 40px;
    height: 40px;

    background-color: lightgray;
    border-radius: 50%;
}

.content {
    width: 100%;
    padding: 0px 10px;

    color: #3b4a54;

    display: flex;
    width: 100%;
    flex-direction: column;

    user-select: none;

    overflow: hidden;
}

.contentHeader {
    margin-top: 8px;
    display: flex;

    justify-content: flex-start;
}

.contentTitle {
    color: v-bind(textColor);
    font-weight: 600;

    flex: 1 1 auto;

    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;

    user-select: none;

    overflow: hidden;
}

.contentBody {
    margin-top: 2px;
    margin-bottom: 3px;

    color: v-bind(textColor);
    font-size: small;
}

.iconContainer {
    padding: 5px 20px 5px 0px;
    color: v-bind(iconColor);
}

.iconContainer:hover {
    cursor: pointer;
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

.verticalLine {
    border-right: 1px solid rgb(200, 200, 200);
    height: 30px;
    margin: 10px 30px;
}

.chatSettings {
    float: right;
}

.menu {
    z-index: 3;
    width: 300px;
    padding: 0px;
    position: fixed;
    right: 10px;
    background-color: v-bind(backgroundColor);
    border-radius: 5px;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
}

.menuContainer {
    display: flex;
    flex-direction: horizontal;
    align-items: center;
}

.menuContainer:hover {
    background-color: v-bind(hoverColor);
    cursor: pointer;
}

.textContainer {
    color: v-bind(textColor);
    width: 100%;
    height: 2em;
    padding: 20px;
    border-bottom: 1px solid v-bind(lineColor);


    display: flex;
    align-items: center;
}

.textContainerlastElement {
    border-bottom: 0px;
}

.contentTextBody {
    font-size: medium;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>
