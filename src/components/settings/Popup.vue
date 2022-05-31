<script setup lang="ts">
import { useColorStore } from '../../stores/colorStore'

import { ref,computed } from "vue"

import { useI18n } from 'vue-i18n'

import { useMainStore } from '../../stores/mainStore';

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const mainStore = useMainStore()

const colorStore = useColorStore()

const mode = ref('')

</script>

<template>
    <transition>
        <div v-if="mainStore.settingPage == 'theme'" class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">{{ t('popup.popupHeaderText') }}</slot>
                    </div>

                    <div class="modal-body">
                        <input type="radio" name="body" value="light" v-model="mode"> {{ t('popup.lightModeText') }} <br>
                    </div>

                    <div class="modal-body">
                        <input type="radio" name="body" value="dark" v-model="mode"> {{ t('popup.darkModeText') }} <br>
                    </div>

                    <div class="modal-body">
                        <input type="radio" name="body" value="auto" v-model="mode"> {{ t('popup.autoModeText') }} <br>
                    </div>

                    <div class="modal-footer">
                        <div class="modal-default-button" @click="mainStore.gotoSettingsPage('')">
                            {{ t('popup.cancelButton') }}
                        </div>
                        <div class="modal-default-button" @click="colorStore.changePreferColorSchema(mode);mainStore.gotoSettingsPage('')">
                            {{ t('popup.okButton') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>

</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.706);
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(100, 100, 100, 0.33);
    transition: all 0.3s ease;
}

.modal-header {
    margin-top: 0;
}

.modal-footer {
    padding: 10px;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    background-color: #007AFF;
    padding: 5px 10px 4px 10px;
    color: white;
    cursor: pointer;
    height: 20px;
    width: fit;

    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 10px;
    font-weight: 400; 
}

</style>