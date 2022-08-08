<script setup lang="ts">
import { ref, watch, computed } from 'vue'

import { useMainStore } from '../stores/mainStore'

import HomeMain from './home/HomeMain.vue'
import GroupsMain from './groups/GroupsMain.vue'
import ChatsMain from './chats/ChatsMain.vue'

const mainStore = useMainStore()

const page = computed(() => {
    return mainStore.page
})

const openGroups = ref(false)
const openChats = ref(false)

watch(page, (newVal, oldVal) => {
    if(newVal == 'settings') {
        if (oldVal == 'chats') {
            openChats.value = true
            openGroups.value = false
        }
        else if (oldVal == 'groups') {
            openChats.value = false
            openGroups.value = true
            console.log(openGroups.value)
        }
        else {
            openChats.value = false
            openGroups.value = false
        }
    }
    else {
        openChats.value = false
        openGroups.value = false
    }
})
</script>

<template>

<div id="wrapper">

    <keep-alive>
        <HomeMain v-if='mainStore.page == "home"'/>
    </keep-alive>
    <keep-alive>
        <GroupsMain v-if='mainStore.page == "groups" || openGroups'/>
    </keep-alive>    
    <keep-alive>
        <ChatsMain v-if='mainStore.page == "chats" || openChats'/>
    </keep-alive>

</div>

</template>

<style scoped>

#wrapper {
    width: 100%;
    height: 100%;

    border-left: 0px solid #b8b7b7;

    background-color: rgb(229, 229, 247);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

#header {
    flex: 0 0 50px;
    background-color: #f0f2f5;
    padding: 10px;
}

#content {
    flex: 1 1 auto;
}

</style>
