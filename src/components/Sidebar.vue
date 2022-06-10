<script setup lang="ts">
import { ref } from 'vue'

import { useMainStore } from '../stores/mainStore'

import HomeSidebar from './home/HomeSidebar.vue'
import GroupsSidebar from './groups/GroupsSidebar.vue'
import ChatsSidebar from './chats/ChatsSidebar.vue'
import SettingsSidebar from './settings/settingsSidebar.vue'

const mainStore = useMainStore()

</script>

<template>

<div class="wrapper">

    <keep-alive>
        <HomeSidebar v-if='mainStore.page == "home"' />
    </keep-alive>
    <keep-alive>
        <GroupsSidebar v-if='mainStore.page == "groups"' />
    </keep-alive>
    <keep-alive>
        <ChatsSidebar v-if='mainStore.page == "chats"' />
    </keep-alive>
    <keep-alive>
        <SettingsSidebar v-if='mainStore.page == "settings"' />
    </keep-alive>
    
</div>

</template>

<style scoped>

.wrapper {
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    overflow: hidden;
}


#listBox {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
}

.container {
    display: flex;
    flex-direction: horizontal;
    padding: 0px;
}
.container:hover {
    background-color: rgb(226, 226, 226);
    cursor: pointer;
}
.avatarContainer {
    flex: 0 0 70px;
    padding: 10px 0px 10px 10px;
}
.avatar {
    width: 50px;
    height: 50px;
 
    background-color: lightgray;
    border-radius: 50%;
}
.content {
    margin-top: 5px;
    width: 100%;
    padding: 10px 10px 10px 5px;
    border-bottom: 1px solid rgb(226, 224, 224);

    color: #3b4a54;

    display: flex;
    width: 100%;
    flex-direction: column;

    user-select: none;

    overflow: hidden;
}

.contentHeader {
    padding-bottom: 3px;
    display: flex;
    
    justify-content: flex-start;
}

.contentTitle {
    color: #111b21;
    font-weight: 600; 

    flex: 1 1 auto;

    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap; 

    user-select: none;

    overflow: hidden;
}

.contentTimestamp {
    flex: 0 0 auto;
    color: gray;

    user-select: none;
}
</style>
