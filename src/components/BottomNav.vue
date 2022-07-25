<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { storeToRefs } from 'pinia'

import { useMainStore } from '../stores/mainStore'
import { useConnStore } from '../stores/connStore'
import commonColors from "../common/colors"

import { useI18n } from 'vue-i18n'

const mainStore = useMainStore()
const connStore = useConnStore()
const primaryBlue = commonColors.primaryBlue

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

</script>

<template>

<div id="wrapper">
    <div class="sideIconWrapper" >
        <div :class="['sideIcon', {selected: mainStore.page == 'home'}]" @click='mainStore.gotoPage("home")'>
            <div class="icon">
                <font-awesome-icon :icon="['fas', 'house']" />
            </div>
            <div class="sideIconLabel">
                {{ t('general.home') }}
            </div>
        </div>
    </div>

    <div class="sideIconWrapper">
        <div :class="['sideIcon', {selected: mainStore.page == 'groups'}]" @click='mainStore.gotoPage("groups")'>
            <div class="icon">
                <font-awesome-icon :icon="['fas', 'user-group']" />
            </div>
            <div class="sideIconLabel">
                {{ t('general.groups') }}
            </div>
        </div>
    </div>    

    <div class="sideIconWrapper">
        <div :class="['sideIcon', {selected: mainStore.page == 'chats'}]" @click='mainStore.gotoPage("chats")'>
            <div class="icon">
                <font-awesome-icon :icon="['fas', 'message']" />
            </div>
            <div class="sideIconLabel">
                {{ t('general.chats') }}
            </div>
        </div>
    </div>
    
    <div class="sideIconWrapper">
        <div :class="['sideIcon', {selected: mainStore.page == 'settings'}]" @click='mainStore.gotoPage("settings")'>
            <div class="icon">
                <font-awesome-icon :icon="['fas', 'gear']" />
            </div>
            <div class="sideIconLabel">
                {{ t('general.settings') }}
            </div>
        </div>
    </div>    

</div>

</template>

<style scoped>

#wrapper {
    width: 100%;
    height: 100%;
    color: gray;

    padding: 10px 10px 10px 10px;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    gap: 20px;

    user-select: none;
}

.sideIconWrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    
    align-items: center;
}

.selected {
    color: v-bind(primaryBlue);
}

.sideIcon {
    width: 100%;
    font-size: 14px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.icon {
    flex: 0 0 30%;
    justify-self: center;
    text-align: center;
}

.sideIcon:hover {
    color: v-bind(primaryBlue);
    cursor: pointer;
}

.sideIconLabel {
    font-size: 11px;
    white-space: nowrap;
    justify-self: flex-start;
}

</style>
