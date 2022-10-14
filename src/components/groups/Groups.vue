<script setup lang="ts">
    import { ComputedRef, computed } from 'vue'
    import { storeToRefs } from 'pinia'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import GroupsSidebar from '@/components/groups/GroupsSidebar.vue'
    import GroupsMain from '@/components/groups/GroupsMain.vue'

    const mainStore = useMainStore()
    const colorStore = useColorStore()
    
    const { 
        background: backgroundColor,
    } = storeToRefs(colorStore) 

    const sideBarWidth: ComputedRef<string> = computed((): string => {
        let widthPercent = '30%'
        if (!mainStore.showGroupsSidebar) {
            widthPercent = '0%'
            return widthPercent
        } 

        if (mainStore.isMobile) {
            widthPercent = '100%'
        }

        return widthPercent
    })

</script>

<template>

    <div class="groupsWrapper">

        <div class="sidebar">
            <GroupsSidebar/>
        </div>

        <div v-if="mainStore.groupsPageGroupID" class="mainPanel">
            <GroupsMain :key="mainStore.groupsPageGroupID"/>
        </div>

    </div>

</template>

<style scoped>

    .groupsWrapper {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
    }

    .sidebar {
        flex: 0 0 v-bind(sideBarWidth);
        overflow: hidden;
        transition: flex 300ms ease-in-out;
    }

    .mainPanel {
        flex: 1 1 auto;
        /* 
        * needed for mobile Safari where input box would keep expanding flexbox
        * reference: https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size
        */
        min-width: 0;
    }
    
</style>
