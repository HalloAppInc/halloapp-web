<script setup lang="ts">
    import { ref } from 'vue'
    import { useMainStore } from '../../stores/mainStore'

    import Feed from '../feed/Feed.vue'
    import GroupFeedHeader from './GroupFeedHeader.vue'

    const mainStore = useMainStore()

    const feedRef = ref<InstanceType<typeof Feed>>()

    const postsList = [
        { 
            groupID: "1",
            title: "Test group",
            subtitle: "this is a link",
            timestamp: "1649204213",
        },
        { 
            groupID: "2",
            title: "Group 2",
            subtitle: "apple",
            timestamp: "1649204213",
        },
        { 
            groupID: "3",
            title: "Group 3",
            subtitle: "this is a link",
            timestamp: "1649204213",
        },     
        { 
            groupID: "4",
            title: "Group 4",
            subtitle: "this is a link",
            timestamp: "1649204213",
        },
        {
            groupID: "5",
            title: "Group 5",
            subtitle: "this is a link",
            timestamp: "1649204213",
        },
        { 
            groupID: "6",
            title: "Group 6",
            subtitle: "this is a link",
            timestamp: "1649204213",
        },
        { 
            groupID: "7",
            title: "Group 7",
            subtitle: "this is a link",
            timestamp: "1649204213",
        },     
        { 
            groupID: "8",
            title: "Group 8",
            subtitle: "this is a link",
            timestamp: "1649204213",
        },          
    ]

    function commentsClick() {
        
        mainStore.showSidebar = !mainStore.showSidebar
    }

    function toggleSidebar() {
        feedRef.value?.closeCommentsPanel()
        mainStore.showSidebar = !mainStore.showSidebar
    }

</script>

<template>

    <!-- <Feed ref="feedRef" :postsList="postsList" @commentsClick="commentsClick()">
        <template v-slot:header>
            <GroupFeedHeader @toggleSidebar="toggleSidebar()"></GroupFeedHeader>
        </template>
    </Feed> -->

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
