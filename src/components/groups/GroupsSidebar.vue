<script setup lang='ts'>
    import { Ref, ref, onUnmounted } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'

    import { db, Group, MediaType } from '@/db'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { useTimeformatter } from '@/composables/timeformatter'
    
    import GroupsSidebarHeader from '@/components/groups/GroupsSidebarHeader.vue'
    import GroupAvatar from '@/components/media/GroupAvatar.vue'

    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })
    
    const mainStore = useMainStore()
    const colorStore = useColorStore()
    const { formatTimeForGroupsList } = useTimeformatter()

    let subscription: any


    const dbListData: Ref<Group[]> = ref([])
    const listData: Ref<Group[]> = ref([])
    const count = ref(15)

    setupObserver()

    async function setupObserver() {
        if (!mainStore.allowDbTransactions) { return }
        const observable = liveQuery (() => db.group.reverse().sortBy('lastChangeTimestamp'))
        subscription = observable.subscribe({
            next: result => { 
                if (!mainStore.allowDbTransactions) { return }
                if (result) {
                    dbListData.value = result
                }
                makeList()
            
            },
            error: error => console.error(error)
        })
    }


    function makeList() {

        if (dbListData.value.length > count.value) {
            listData.value = dbListData.value.slice(0, count.value)
        } else {
            listData.value = dbListData.value       
        }

        /* select the top group if there wasn't any group selected */
        if (!mainStore.groupsPageGroupID && listData.value.length > 0) {
            mainStore.selectGroup(listData.value[0].groupID)
        }

    }

    const content = ref<HTMLElement | null>(null)
    let handleScrollTimer: any

    function handleScroll() {
        clearTimeout(handleScrollTimer)
        handleScrollTimer = setTimeout(debouncedHandleScroll, 200)
    }


    function debouncedHandleScroll() {
        if (!content.value) { return }

        /* fetch more posts before user gets to the end of their feed */
        const element = content.value
        const scrolled = element.scrollHeight - element.scrollTop
        const nearEnd = element.clientHeight * 3 // 2 screens up, less than 3 doesn't seem to work well
        if (scrolled < nearEnd) {
            
            makeList()
            count.value += 15
        }

    }



    onUnmounted(() => {
        if (subscription) {
            subscription.unsubscribe()
        }
    })

    const { 
        primaryLightgray: primaryLightgrayColor,
        background: backgroundColor,
        secondaryBg: secondaryBgColor,
        primaryBlue: primaryBlueColor,
        text: textColor,
        secondaryText: secondaryTextColor,
        line: lineColor,
        secondaryBgHover: secondaryBgHoverColor,
        secondaryBgSelected: secondaryBgSelectedColor,
        secondaryBorder: secondaryBorderColor,
    } = storeToRefs(colorStore)  

    

</script>

<template>

    <div class="groupsSidebarWrapper">

        <div class="header"> 
            <GroupsSidebarHeader></GroupsSidebarHeader>
        </div>

        <div class="listBox" ref='content' @scroll='handleScroll()'> 
            <div v-for="value in listData" :key="value.groupID"
                :class="['container', {selected: mainStore.groupsPageGroupID == value.groupID}]"
                @click="mainStore.gotoGroup(value.groupID)">
                <div class="avatarContainer">

                    <GroupAvatar :groupID="value.groupID" :width="50">
                    </GroupAvatar>

                </div>
                <div class="content">
                    <div class="contentHeader">
                        <div class="contentTitle">
                            {{ mainStore.groupnames[value.groupID] }}
                        </div>
                        <div v-if="value.lastChangeTimestamp" class="contentTimestamp">
                            {{ formatTimeForGroupsList(value.lastChangeTimestamp, locale as string) }}
                        </div>
                    </div>
                    <div class="contentBody" >
                        <div v-if="value.lastContentMediaType == MediaType.Image" class="iconBox" >
                            <font-awesome-icon :icon="['fas', 'image']" />
                        </div>
                        <div v-else-if="value.lastContentMediaType == MediaType.Video" class="iconBox" >
                            <font-awesome-icon :icon="['fas', 'video']" />
                        </div>
                        <div :class="['text', {'paddingLeft': value.lastContentMediaType != 0}]" v-html="value.lastContent">
                        </div>
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
        background: v-bind(secondaryBgColor);        /* color of the tracking area */
    }

    *::-webkit-scrollbar-thumb {
        background-color: v-bind(primaryLightgrayColor);    /* color of the scroll thumb */
    
        border: 0px solid white;  /* creates padding around scroll thumb */
    }

    .groupsSidebarWrapper {

        height: 100%;
        border-right: 1px solid v-bind(secondaryBorderColor);

        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        overflow: hidden;
    }

    .header {
        flex: 0 0 50px;
    }

    .listBox {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;

        background-color: v-bind(secondaryBgColor);
    }

    .container {
        display: flex;
        flex-direction: horizontal;
        padding: 0px;
    }

    .container:hover {
        /* background-color: rgb(226, 226, 226); */
        background-color: v-bind(secondaryBgHoverColor);
        cursor: pointer;
    }

    .selected {
        /* background-color: rgb(205, 203, 203); */
        background-color: v-bind(secondaryBgSelectedColor);
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
        border-bottom: 1px solid v-bind(secondaryBorderColor);

        color: v-bind(secondaryTextColor);

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
        color: v-bind(textColor);;
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

    .contentBody {
        position: relative;
    }

    .contentBody .iconBox {
        position: absolute;
        left: 0;
    }

    .contentBody .text {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .contentBody .paddingLeft {
        padding-left: 25px;
    }    

</style>
