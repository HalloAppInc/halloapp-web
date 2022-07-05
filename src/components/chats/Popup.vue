<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const mainStore = useMainStore()
const colorStore = useColorStore()

const title = computed(() => {
    if (mainStore.chatPage == 'clear') {
        return t('clearMessagesPopup.popupHeaderText')
    }
    else if (mainStore.chatPage == 'delete') {
        return t('deleteMessagesPopup.popupHeaderText')
    }
})

const content = computed(() => {
    if (mainStore.chatPage == 'clear') {
        return t('clearMessagesPopup.popupContent')
    }
    else if (mainStore.chatPage == 'delete') {
        return t('deleteMessagesPopup.popupContent')
    }
})

const backgroundColor = computed(() => {
    return colorStore.background
})
const textColor = computed(() => {
    return colorStore.text
})
const wraperColor = computed(() => {
    return colorStore.wraper
})
const shadowColor = computed(() => {
    return colorStore.shadow
})
</script>

<template>
    <transition>
        <div class='mask' v-if="mainStore.chatPage == 'delete' || mainStore.chatPage == 'clear'">
            <div class='wrapper'>
                <div class='container'>
                    <div class='header'>
                        <div class='title'>
                            {{ title }}
                        </div>
                    </div>

                    <div class='body'>
                        <div class='textContent' value='light'>
                            {{ content }}
                        </div>
                    </div>

                    <div class='footer'>
                        <div class='button' @click="$emit('clickOk');mainStore.gotoChatPage('chat')">
                            {{ t('button.okButton') }}
                        </div>
                        <div class='button' @click="mainStore.gotoChatPage('chat')">
                            {{ t('button.cancelButton') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>

</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.mask {
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: v-bind(wraperColor);
    display: table;
}

.wrapper {
    display: table-cell;
    vertical-align: middle;
}

.container {
    width: 500px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: v-bind(backgroundColor);
    border-radius: 2px;
    box-shadow: -2px 2px 8px v-bind(shadowColor);
    transition: all 0.3s ease;
}

.header {
    margin-top: 0;
    color: v-bind(textColor);
    font-size: large;
}

.title {
    font-weight: 600;
    font-size: larger;
}

.body {
    margin: 20px 0;
    color: v-bind(textColor);
}


.textContent {
    font-size: medium;
}

.footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 10px;
}

.button {
    float: right;
    border-radius: 20px;
    margin-left: 20px;
    background-color: #5ba4fc;
    padding: 5px 15px 5px 15px;
    color: white;

    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 15px;
    font-weight: bold;
}

.button:hover {
    cursor: pointer;
    background-color: gray;
    box-shadow: -2px 2px 5px v-bind(shadowColor);
}
</style>