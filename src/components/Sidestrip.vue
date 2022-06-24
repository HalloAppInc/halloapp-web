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
                {{ t('sidestrip.home') }}
            </div>
        </div>
    </div>

    <div class="sideIconWrapper">
        <div :class="['sideIcon', {selected: mainStore.page == 'groups'}]" @click='mainStore.gotoPage("groups")'>
            <div class="icon">
                <font-awesome-icon :icon="['fas', 'user-group']" />
            </div>
            <div class="sideIconLabel">
                {{ t('sidestrip.groups') }}
            </div>
        </div>
    </div>    

    <div class="sideIconWrapper">
        <div :class="['sideIcon', {selected: mainStore.page == 'chats'}]" @click='mainStore.gotoPage("chats")'>
            <div class="icon">
                <font-awesome-icon :icon="['fas', 'message']" />
            </div>
            <div class="sideIconLabel">
                {{ t('sidestrip.chats') }}
            </div>
        </div>
    </div>
    
    <div class="sideIconWrapper sideIconWrapperTop">
        <div :class="['sideIcon', {selected: mainStore.page == 'settings'}]" @click='mainStore.gotoPage("settings")'>
            <div class="icon">
                <font-awesome-icon :icon="['fas', 'gear']" />
            </div>
            <div class="sideIconLabel">
                {{ t('sidestrip.settings') }}
            </div>
        </div>
    </div>    

    <div class="sideIconWrapper sideIconWrapperBottom" @click="connStore.logout()">
        <div class="sideIcon">
            <div class="icon">
                <font-awesome-icon :icon="['fas', 'power-off']" />
            </div>
            <div class="sideIconLabel">
                {{ t('sidestrip.exit') }}
            </div>
        </div>
    </div>
</div>

</template>

<style scoped>

#wrapper {
    width: 100%;
    height: 100%;
    color: white;

    padding: 70px 10px 30px 10px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
.sideIconWrapperTop {
    flex: 1 0 auto;
    justify-self: flex-end;
}

.sideIconWrapperBottom {
    flex: 0 0 auto;
    justify-self: flex-end;
    
}

.selected {
    color: v-bind(primaryBlue);
}

.sideIcon {
    width: 100%;
    font-size: 14px;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
}

.icon {
    flex: 0 0 30%;
    justify-self: center;
    text-align: center;
}

.sideIcon:hover {
    /* color: v-bind(primaryBlue); */
    color: v-bind(primaryBlue);
    cursor: pointer;
}

.sideIconLabel {
    font-size: 11px;
    white-space: nowrap;
    justify-self: flex-start;
}

@media only screen and (max-width: 800px) {
    .sideIconLabel {
        display: none;
    }
}

</style>
