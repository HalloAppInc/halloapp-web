<script setup lang="ts">
import { directive } from '@babel/types';
import { ref, computed, nextTick } from 'vue'

import { useI18n } from 'vue-i18n'

import { useColorStore } from '../../stores/colorStore'

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const colorStore = useColorStore()

const props = defineProps(['showPopup'])

const emit = defineEmits(['deleteForEveryone', 'deleteForMe', 'confirmOk', 'changePreferColorScheme'])

const mode = ref()

const title = computed(() => {
    if (props.showPopup.type == 'clear') {
        return t('clearMessagesPopup.popupHeaderText')
    }
    else if (props.showPopup.type == 'delete') {
        return t('deleteMessagesPopup.popupHeaderText')
    }
    else if (props.showPopup.type == 'theme') {
        mode.value = props.showPopup.mode
        return t('themePopup.popupHeaderText')
    }
})

const content = computed(() => {
    if (props.showPopup.type == 'clear') {
        return t('clearMessagesPopup.popupContent')
    }
    else if (props.showPopup.type == 'delete') {
        return t('deleteMessagesPopup.popupContent')
    }
    else if (props.showPopup.type == 'theme') {
        return ''
    }
})

const buttonType = computed(() => {
    if (props.showPopup.type == 'clear') {
        return 'twoButton'
    }
    else if (props.showPopup.type == 'delete') {
        if (props.showPopup.messageType == 'normal') {
            return 'threeButton'
        }
        else if (props.showPopup.messageType == 'deleted') {
            return 'twoButton'
        }
    }
    else if (props.showPopup.type == 'theme') {
        return 'themeButton'
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

function closeMenu(emitEventName: any = null, emitEventData: any = null) {
    props.showPopup.value = false
    if (props.showPopup.type == 'theme') {
        mode.value = props.showPopup.mode
        emit(emitEventName, emitEventData)
    }
    else{
        if (emitEventName) {
            emit(emitEventName)
        }
    }
}
</script>

<template>
    <transition>
        <div class='mask' v-if='showPopup.value'>
            <div class='wrapper'>
                <div class='container'>

                    <div class='header'>
                        <div class='title'>
                            {{ title }}
                        </div>
                    </div>

                    <div class='body'>
                        <div v-if='content' class='textContent'>
                            {{ content }}
                        </div>
                        <div v-if='showPopup.type == "theme"'>
                            <div class='selectionContent'>
                                <input type='radio' value='light' v-model='mode'> {{ t('themePopup.lightModeText') }} <br>
                            </div>
                            <div class='selectionContent'>
                                <input type='radio' value='dark' v-model='mode'> {{ t('themePopup.darkModeText') }} <br>
                            </div>
                            <div class='selectionContent'>
                                <input type='radio' value='auto' v-model='mode'> {{ t('themePopup.autoModeText') }} <br>
                            </div>
                        </div>
                    </div>

                    <div class='footer'>

                        <div v-if="buttonType == 'threeButton'" class='buttonContainerCol'>
                            <div class='button buttonLong buttonRed'
                                @click='closeMenu("deleteForEveryone")'>
                                {{ t('button.deleteForEveryone') }}
                            </div>
                            <div class='button buttonLong buttonRed'
                                @click='closeMenu("deleteForMe")'>
                                {{ t('button.deleteForMeButton') }}
                            </div>
                            <div class='button buttonLong buttonGray' @click="closeMenu">
                                {{ t('button.cancelButton') }}
                            </div>
                        </div>

                        <div v-else-if="buttonType == 'twoButton'" class='buttonContainerRow'>
                            <div class='button buttonBlue' @click='closeMenu("confirmOk")'>
                                {{ t('button.okButton') }}
                            </div>
                            <div class='button buttonGray' @click='closeMenu'>
                                {{ t('button.cancelButton') }}
                            </div>
                        </div>

                        <div v-else-if="buttonType == 'themeButton'" class='buttonContainerRow'>
                            <div class='button buttonBlue' @click='closeMenu("changePreferColorScheme", mode)'>
                                {{ t('button.okButton') }}
                            </div>
                            <div class='button buttonGray' @click='closeMenu("changePreferColorScheme")'>
                                {{ t('button.cancelButton') }}
                            </div>
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

.selectionContent {
    margin: 10px 0px;
}

.footer {
    padding: 10px;
}

.buttonContainerRow {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.buttonContainerCol {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
}

.button {
    float: right;
    border-radius: 20px;
    margin-left: 20px;
    margin-top: 10px;
    padding: 10px 30px 10px 30px;
    color: white;

    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 15px;
    font-weight: bold;
}

.button:hover {
    cursor: pointer;
    box-shadow: -2px 2px 5px v-bind(shadowColor);
}

.buttonBlue {
    background-color: #007AFF;
}

.buttonBlue:hover {
    background-color: rgb(0, 91, 182);
}

.buttonRed {
    background-color: rgb(244, 69, 53);
}

.buttonRed:hover {
    background-color: rgb(207, 57, 46);
}

.buttonGray {
    color: black;
    background-color: rgb(233, 233, 233);
}

.buttonGray:hover {
    background-color: rgb(195, 195, 195);
}

.buttonLong {
    text-align: center;
    font-size: 15px;
}
</style>