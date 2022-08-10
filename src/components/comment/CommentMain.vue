<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMainStore  } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'
import { useTimeformatter } from '../../composables/timeformatter'

import { useI18n } from 'vue-i18n'

import CommentHeader from './CommentHeader.vue'
import ChatPanel from '../chats/ChatPanel.vue'
import InputBox from '../chats/InputBox.vue'

import Avatar from '../media/Avatar.vue'

const mainStore = useMainStore()
const colorStore = useColorStore()

const { formatTime } = useTimeformatter()

const props = defineProps(['postID'])

const content = ref<HTMLElement | null>(null)

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})



const messageList = ref([
    {
        type: "timestamp",
        timestamp: "1649204213",
    },
    {
        type: "inBound",
        message: "Short text testing:<br> ~123~ <s>123</s>,_123_<i>123</i>,*123*<b>123</b>",
        timestamp: "1649204213",
        display: true,
    },
    {
        type: "outBound",
        message: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
        timestamp: "1649204213",
        display: true
    },
    {
        type: "timestamp",
        timestamp: "1656853200"
    },
    {
        type: "inBound",
        message: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
        timestamp: "1656853200",
        display: true
    },
    {
        type: "timestamp",
        timestamp: "1657026000",
    },
    {
        type: "inBound",
        quoteIdx: 1,
        message: "asdfasdfsadfasdflsadkfl;sdakf;lasdkf;asdkf;lasdkf;lsadkf;lsadkf;sadkf;lasdfksd;lfksd;lfdsf",
        timestamp: "1657026000",
        display: true
    },
    {
        type: "inBound",
        quoteIdx: 2,
        message: "😍😍😍😍",
        timestamp: "1657026000",
        display: true
    },
    {
        type: "inBound",
        message: "😍!",
        timestamp: "1657026000",
        display: true
    },
    {
        type: "inBound",
        message: "😍",
        timestamp: "1657026000",
        display: true
    },
    {
        type: "inBound",
        message: "☺️", // this emoji can't be displayed 
        timestamp: "1657026000",
        display: true
    },
    {
        type: "inBound",
        message: "❤️",  // this emoji can't be detected
        timestamp: "1657026000",
        display: true
    },
    {
        type: "timestamp",
        timestamp: "1657112400",
    },
    {
        type: "inBound",
        message: "asdfasdfsadfasdflsadkfl;sdakf;lasdkf;asdkf;lasdkf;lsadkf;",
        timestamp: "1657112400",
        display: true
    }
])

const contactList = ref([
    "UserA",
    "UserB",
    "abcd123",
    "?@#$%^&"
])

// todo: look into object to see if it's needed
const replyQuoteIdx = ref({'value': -1})

const messageNumber = computed(() => {
    return messageList.value.length
})

</script>

<template>

    <!-- nb: root nodes are affected by scoped styles from parent -->
    <div class='commentMainWrapper'>

        <div class='header'>
            <CommentHeader :postID='postID' @backClick="$emit('backClick')"/>
        </div>

        <div class='content' ref='content'>
            <ChatPanel>

                <template v-slot:subHeader>
                    <div class='subHeader'>
                        <div>
                            <Avatar :userID="'TonyTemp'" :width="'30px'"></Avatar>
                        </div>
                        <div class='subHeaderBody'>
                            <div>
                                Test User
                            </div>
                            <div>
                                
                            </div>
                            <div>
                                Test test test
                            </div>
                            <div class='timestamp'>
                                {{ formatTime(1657026000, locale) }}
                            </div>
                        </div>
                    </div>
                </template>

            </ChatPanel>
        </div>

        <!-- input tray -->
        <div class='footer'>

            <InputBox 

                :uploadFiles='""'
                :alwaysShowSendButton='false'
                :replyQuoteIdx='replyQuoteIdx' />
            
        </div>

    </div>

</template>

<style scoped>
.commentMainWrapper {
    width: 100%;
    height: 100%;
    position: relative;

    background-color: rgb(243, 243, 240);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.header {
    flex: 1 1 50px;
    background-color: #f0f2f5;
}

.subHeader {
    background-color: rgb(243, 243, 240);
    padding: 5px 15px 10px 15px;

    border-bottom: 1px solid rgb(232,232,232);

    display: flex;
    flex-direction: row;
    gap: 0px 10px;

    z-index: 10; /* used to cover up the floating timestamp in chat panel */
}

.timestamp {
    color: gray;
    font-size: 14px;
}

.content {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
}

.footer {
    width: 100%;

    background-color: rgb(243, 243, 240);

    padding: 5px 10px 5px 10px;
}


</style>