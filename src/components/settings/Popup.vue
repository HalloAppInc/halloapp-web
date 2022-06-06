<script setup lang="ts">
import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

import { ref, computed } from 'vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const mainStore = useMainStore()
const colorStore = useColorStore()

const mode = ref(mainStore.preferColorScheme)

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
        <div v-if="mainStore.settingsPage == 'theme'" class='mask'>
            <div class='wrapper'>
                <div class='container'>
                    <div class='header'>
                        <slot name='header'>{{ t('popup.popupHeaderText') }}</slot>
                    </div>

                    <div class='body'>
                        <input type='radio' value='light' v-model='mode'> {{ t('popup.lightModeText') }} <br>
                    </div>

                    <div class='body'>
                        <input type='radio' value='dark' v-model='mode'> {{ t('popup.darkModeText') }} <br>
                    </div>

                    <div class='body'>
                        <input type='radio' value='auto' v-model='mode'> {{ t('popup.autoModeText') }} <br>
                    </div>

                    <div class='footer'>
                        <div class='button' @click="mainStore.gotoSettingsPage(''); mode = mainStore.preferColorScheme">
                            {{ t('button.cancelButton') }}
                        </div>
                        <div class='button'
                            @click="colorStore.changePreferColorSchema(mode); mainStore.gotoSettingsPage(''); mode = mainStore.preferColorScheme">
                            {{ t('button.okButton') }}
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
    z-index: 9998;
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
    width: 300px;
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

.footer {
    display: flex;
    flex-direction: row-reverse;
    align-content: flex-end;
    padding: 10px;
}

.body {
    margin: 20px 0;
    color: v-bind(textColor);
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