<script setup lang="ts">
    import { Ref, ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db, Feed } from '@/db'

    import FeedList from '@/components/feed/FeedList.vue'
    import GroupFeedHeader from '@/components/groups/GroupFeedHeader.vue'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const feedRef = ref<InstanceType<typeof FeedList>>()

    let groupID = mainStore.groupsPageGroup.groupID

    const listData: Ref<Feed[]> = ref([])

    const feedObservable = liveQuery (() => db.feed.where('groupID').equals(groupID)
        .reverse()
        .sortBy('timestamp')
    )
    const subscription = feedObservable.subscribe({
        next: result => { 
            if (result) {
                listData.value = result
            }
        },
        error: error => console.error(error)
    })

    const { 
        background: backgroundColor,
        secondaryBg: secondaryBgColor,
        primaryBlue: primaryBlueColor,
        text: textColor,
        line: lineColor,
        secondaryBorder: secondaryBorderColor,
    } = storeToRefs(colorStore) 

    function commentsClick() {
        
        mainStore.showSidebar = !mainStore.showSidebar
    }

    function toggleSidebar() {
        feedRef.value?.closeCommentsPanel()
        mainStore.showSidebar = !mainStore.showSidebar
    }

</script>

<template>

    <FeedList ref="feedRef" :postsList="listData" @commentsClick="commentsClick()">
        <template v-slot:header>
            <GroupFeedHeader @toggleSidebar="toggleSidebar()"></GroupFeedHeader>
        </template>
    </FeedList>

</template>

<style scoped>

    .wrapper {
        width: 100%;
        height: 100%;

        /* border-left: 1px solid #b8b7b7; */
        border-left: 1px solid red;

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
