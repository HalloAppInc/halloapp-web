<script setup lang="ts">
    import { ref } from 'vue'
    import { useMainStore } from '../../stores/mainStore'
    import { useTimeformatter } from '../../composables/timeformatter'
    import { useI18n } from 'vue-i18n'

    import GroupsSidebarHeader from './GroupsSidebarHeader.vue'

    const { formatTime } = useTimeformatter()

    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const mainStore = useMainStore()

    const listData = [
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

    mainStore.groupsPageGroup = listData[0]

    function selectGroup(group: any) {
        mainStore.groupsPageGroup = group
    }

</script>

<template>

    <div class="groupsSidebarWrapper">
        <div class="header"> 
            <GroupsSidebarHeader></GroupsSidebarHeader>
        </div>

        <div class="listBox"> 
            <div v-for="value in listData" :key="value.groupID"
                :class="['container', {selected: mainStore.groupsPageGroup.groupID == value.groupID}]"
                @click="selectGroup(value)">
                <div class="avatarContainer">
                    <div class="avatar"></div>
                </div>
                <div class="content">
                    <div class="contentHeader">
                        <div class="contentTitle">
                            {{ value.title }}
                        </div>
                        <div class="contentTimestamp">
                            {{ formatTime(parseInt(value.timestamp), locale) }}
                        </div>
                    </div>
                    <div class="contentBody">
                        {{ value.subtitle }}
                    </div>
                </div>
                
            </div>
        </div>
    </div>

</template>

<style scoped>

    *::-webkit-scrollbar {
        width: 5px;
    }

    *::-webkit-scrollbar-track {
        background: white;        /* color of the tracking area */
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgb(172, 169, 169);    /* color of the scroll thumb */
    
        border: 0px solid white;  /* creates padding around scroll thumb */
    }

    .groupsSidebarWrapper {

        height: 100%;
        border-right: 1px solid #b8b7b7;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        overflow: hidden;
    }

    .header {
        flex: 0 0 50px;
        background-color: #f0f2f5;
    }

    .listBox {
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

    .selected {
        background-color: rgb(205, 203, 203);
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
