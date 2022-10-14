<script setup lang="ts">
    import { ref, watch, computed, ComputedRef } from 'vue'

    import { useMainStore } from '@/stores/mainStore'

    import HomeMain from '@/components/home/HomeMain.vue'
    import Groups from '@/components/groups/Groups.vue'
    import ChatsMain from '@/components/chats/ChatsMain.vue'

    import SettingsSidebar from '@/components/settings/SettingsSidebar.vue'

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


    const sideBarWidth: ComputedRef<string> = computed((): string => {
        let widthPercent = '0px'
        if (mainStore.showSettings) {
            widthPercent = '400px'
            return widthPercent
        } 

        return widthPercent
    })


</script>

<template>

    <div class="mainPanelWrapper">

        <keep-alive>
            <HomeMain v-show='mainStore.page == "home"'/>
        </keep-alive>
        <keep-alive>
            <Groups v-show="mainStore.page == 'groups' || openGroups"/>
        </keep-alive>    
        <keep-alive>
            <ChatsMain v-show='mainStore.page == "chats" || openChats'/>
        </keep-alive>

            <!-- <div id="Sidebar" :class="[{'animateSlide': mainStore.page == 'groups'}]"> -->

        
        <div class="settingsSidebar">
            <SettingsSidebar/>
        </div>
 


    </div>

</template>

<style scoped>

    .mainPanelWrapper {
        position: relative;

        width: 100%;
        height: 100%;

        border-left: 0px solid #b8b7b7;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .settingsSidebar {
        position: absolute;

        top: 0;
        left: 0;
        height: 100%;
        width: v-bind(sideBarWidth);
        z-index: 10;

        transition: all 0.2s ease-in;
    }



</style>
