<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'

import { useTimeformatter } from '../../composables/timeformatter'
import { useHADatabase } from '../../composables/haDb'
import { useHAText } from '../../composables/haText'

import { useI18n } from 'vue-i18n'

import hal from '../../common/halogger'

import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

const { processText } = useHAText()
const { formatTime } = useTimeformatter()
const { notifyWhenChanged, getAllChat } = useHADatabase()

const mainStore = useMainStore()
const colorStore = useColorStore()

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const selectIdx = ref(-1)
const chatList = ref()

const chatID = computed(() => {
    return mainStore.chatID
})

const timestampColor = computed(() => {
    return colorStore.timestamp
})

watch(chatID,() => {
    setSelectIdx()
})

function setSelectIdx() {
    for(let i = 0; i < chatList.value.length; i++) {
        if (chatList.value[i].userID == mainStore.chatID) {
            selectIdx.value = i
        }
    }
}

let load: any
function loadAllChat() {
    clearTimeout(load)
    load = setTimeout(() => {
        getAllChat()
        .then(res => {
            const result: any =[]
            for (const chat of res) {
                let subtitle
                let font
                if (chat.text) {
                    let text = JSON.parse(JSON.stringify(chat.text))
                    // truncate text
                    if (text.length > 15) {
                        text = text.slice(0, 15) + '...'
                        console.log(text)
                    }
                    subtitle = processText(text, []).html
                    font = 'normal'
                }
                else {
                    subtitle = 'message has been deleted'
                    font = 'deleted'
                }
                result.push({
                    'title': chat.userName,
                    'subtitle': subtitle,
                    'font': font,
                    'timestamp': chat.timestamp,
                    'userID': chat.userID,
                })
            }
            chatList.value = result

            hal.log('ChatSideBar/loadAllChat/chatList/', res)
        })
    }, 15)
}

loadAllChat()

function listener(type: string) {
    hal.log('ChatSidebar/notifyWhenChanged/' + type)
    loadAllChat()
}

notifyWhenChanged(listener)

function openChat(userID: string) {
    mainStore.chatID = userID
    hal.log('ChatSidebar/openChat/' + mainStore.chatID)
}
</script>

<template>

<div class="wrapper">
    <div class="header"> 
        
    </div>
    <div class="listBox"> 
        <div v-for="(value, idx) in chatList" class="container" 
            @click='openChat(value.userID)'
            :class='{"selected" : idx == selectIdx}'>

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
                    <span v-html='value.subtitle' :class='value.font'></span>
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

.wrapper {

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
    padding: 10px;
}

.listBox {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
}

.selected {
    background-color: rgb(226, 226, 226);
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

.contentBody {
    overflow: hidden;
}

.normal {
    overflow-wrap: anywhere;
    white-space: normal;
}

.deleted {
    font-size: small;
    color: v-bind(timestampColor);
}

</style>
