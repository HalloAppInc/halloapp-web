<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { storeToRefs } from 'pinia'

import { useMainStore } from '../stores/mainStore'
import commonColors from "../common/colors"

const mainStore = useMainStore()
const primaryBlue = commonColors.primaryBlue

</script>

<template>

<div id="wrapper">
    <div class="sideIconWrapper" >
        <div :class="['sideIcon', {selected: mainStore.page == 'home'}]" @click='mainStore.gotoPage("home")'>
            <div>
                <font-awesome-icon :icon="['fas', 'house']" />
            </div>
            <div class="sideIconLabel">
                Home
            </div>
        </div>
    </div>

    <div class="sideIconWrapper">
        <div :class="['sideIcon', {selected: mainStore.page == 'groups'}]" @click='mainStore.gotoPage("groups")'>
            <div>
                <font-awesome-icon :icon="['fas', 'user-group']" />
            </div>
            <div class="sideIconLabel">
                Groups
            </div>
        </div>
    </div>    

    <div class="sideIconWrapper">
        <div :class="['sideIcon', {selected: mainStore.page == 'chats'}]" @click='mainStore.gotoPage("chats")'>
            <div>
                <font-awesome-icon :icon="['fas', 'message']" />
            </div>
            <div class="sideIconLabel">
                Chats
            </div>
        </div>
    </div>
    
    <div class="sideIconWrapper sideIconWrapperTop">
        <div :class="['sideIcon', {selected: mainStore.page == 'settings'}]" @click='mainStore.gotoPage("settings")'>
            <div>
                <font-awesome-icon :icon="['fas', 'gear']" />
            </div>
            <div class="sideIconLabel">
                Settings
            </div>
        </div>
    </div>    

    <div class="sideIconWrapper sideIconWrapperBottom" @click="mainStore.logout()">
        <div class="sideIcon">
            <div>
                <font-awesome-icon :icon="['fas', 'power-off']" />
            </div>
            <div class="sideIconLabel">
                Exit
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

    padding-top: 70px;
    padding-bottom: 30px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;

    user-select: none;
}

.sideIconWrapper {

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
    font-size: 14px;

    display: flex;
    flex-direction: column;
    
    align-items: center;
}

.sideIcon:hover {
    /* color: v-bind(primaryBlue); */
    color: v-bind(primaryBlue);
    cursor: pointer;
}

.sideIconLabel {
    font-size: 11px;

}

</style>
