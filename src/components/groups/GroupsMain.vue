<script setup lang="ts">
    import { Ref, ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db } from '@/db'

    import GroupFeedHeader from '@/components/groups/GroupFeedHeader.vue'
    import FeedList from '@/components/feed/FeedList.vue'

    const mainStore = useMainStore()
    const colorStore = useColorStore()
    
    const feedRef = ref<InstanceType<typeof FeedList>>()

    let groupID = mainStore.groupsPageGroupID

    const { 
        background: backgroundColor,
        secondaryBg: secondaryBgColor,
        primaryBlue: primaryBlueColor,
        text: textColor,
        line: lineColor,
        secondaryBorder: secondaryBorderColor,
    } = storeToRefs(colorStore) 

    function openGroupsSidebar() {
        feedRef.value?.closeCommentsPanel()
        mainStore.showGroupsSidebar = true
    }

</script>

<template>

    <FeedList ref="feedRef" :atMainFeed='false' :groupID="groupID">
        <template v-slot:header>
            <GroupFeedHeader @openGroupsSidebar="openGroupsSidebar()"></GroupFeedHeader>
        </template>
    </FeedList>

</template>

<style scoped>

    .wrapper {
        width: 100%;
        height: 100%;

        border-left: 1px solid #b8b7b7;

        background-color: rgb(229, 229, 247);

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .header {
        flex: 0 0 50px;
        background-color: #f0f2f5;
        padding: 10px;
    }

    .content {
        flex: 1 1 auto;
    }

</style>
