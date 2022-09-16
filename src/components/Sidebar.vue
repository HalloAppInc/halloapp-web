<script setup lang="ts">
    import { ref } from 'vue'

    import { useMainStore } from '@/stores/mainStore'

    import HomeSidebar      from '@/components/home/HomeSidebar.vue'
    import GroupsSidebar    from '@/components/groups/GroupsSidebar.vue'
    import ChatsSidebar     from '@/components/chats/ChatsSidebar.vue'
    import SettingsSidebar  from '@/components/settings/settingsSidebar.vue'

    const mainStore = useMainStore()

</script>

<template>

    <div class="sidebarWrapper">

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

    .sidebarWrapper {
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        overflow: hidden;
    }

</style>
