<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore  } from '../../stores/mainStore'

import ChatHeader from './ChatHeader.vue'
import ChatPanel from './ChatPanel.vue'
import ChatFooter from './ChatFooter.vue'

const colorStore = useColorStore()
const mainStore = useMainStore()

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
    "?@#$%^&",
])

const replyQuoteIdx = ref({'value': -1})

const chatName = ref('chat1')
const chatInformation = ref('chatInfo')

const messageNumber = computed(() => {
    return messageList.value.length
})

watch(messageNumber, () => {
    // notifyMe()
})

const chatBackground = computed(() => {
    return colorStore.chatBackground
})

watch(messageNumber, () => {
    // notifyMe()
})

function notifyMe() {
    // check if the browser supports notifications
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notification')
    }

    // check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
        let notification = new Notification('You have a new message!')
    }

    // ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            // user accepts
            if (permission === 'granted') {
                let notification = new Notification('You have a new message!')
            }
        })
    }
}

</script>

<template>

    <div class='wrapper' v-if='mainStore.page == "chats" && mainStore.chatPage != "settings"'>

        <div class='header'>
            <ChatHeader :message-list='messageList'  :chat-name='chatName' :chat-information='chatInformation'/>
        </div>

        <!-- chatting area -->
        <div class='content'>
            <ChatPanel :message-list='messageList' :reply-quote-idx='replyQuoteIdx'/>
        </div>

        <!-- input tray -->
        <div class='footer'>
            <ChatFooter :message-list='messageList' :contact-list='contactList' :reply-quote-idx='replyQuoteIdx'/>
        </div>

    </div>

</template>

<style scoped>
.wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    background-color: rgb(229, 229, 247);

    background-image: repeating-radial-gradient(circle at 0 0, transparent 0, #e5e5f7 10px), repeating-linear-gradient(rgba(242, 193, 139, 0.33), rgb(242, 193, 139, 0.4));

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.header {
    flex: 1 1 50px;
    background-color: #f0f2f5;
}

.footer {
    bottom: 0;
    width: 100%;
}

.content {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: v-bind(chatBackground);
}
</style>