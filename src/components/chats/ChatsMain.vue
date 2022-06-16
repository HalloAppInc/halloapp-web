<script setup lang="ts">

import { ref, computed, watch, nextTick } from 'vue'
import { useColorStore } from '../../stores/colorStore';
import InputBox from './InputBox.vue'
import ChatPanel from './ChatBubble.vue'
import JumpDown from './JumpDown.vue';
import ChatHeader from './ChatHeader.vue';

const colorStore = useColorStore()

const content = ref<HTMLElement | null>(null)

const messageList = ref([
    {
        type: "timestamp",
        message: "",
        timestamp: "1649204213",
    },
    {
        type: "inbound",
        message: "Short text testing:<br> ~123~ <s>123</s>,_123_<i>123</i>,*123*<b>123</b>",
        timestamp: "1649204213",
    },
    {
        type: "outbound",
        message: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
        timestamp: "1649204213",
    },
    {
        type: "inbound",
        message: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
        timestamp: "1649204213",
    },
])

const contactList = ref([
    "UserA",
    "UserB",
    "abcd123",
    "?@#$%^&"
])

const messageNumber = computed(() => {
    return messageList.value.length
})

const chatName = ref('chat1')
const chatInformation = ref('chatInfo')

watch(messageNumber, () => {
    // notifyMe()
    nextTick(() => {
        content.value?.scrollTo(10000, content.value?.scrollHeight)
    });
})

const chatBackground = computed(() => {
    return colorStore.chatBackground
})

function notifyMe() {
    // check if the browser supports notifications
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notification');
    }

    // check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
        var notification = new Notification('You have a new message!');
    }

    // ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            // user accepts
            if (permission === 'granted') {
                var notification = new Notification('You have a new message!');
            }
        });
    }
}

</script>

<template>

    <div id='wrapper'>

        <div id='header'>
            <ChatHeader :chat-name='chatName' :chat-information='chatInformation' />
        </div>

        <!-- chatting area -->
        <div id='content' ref='content'>
            <ChatPanel :message-list='messageList' />
            <!-- jump back down -->
            <JumpDown />
        </div>

        <!-- input tray -->
        <div id='footer'>
            <InputBox :message-list='messageList' :contact-list='contactList' />
        </div>

    </div>

</template>

<style scoped>
*::-webkit-scrollbar {
    width: 5px;
}

*::-webkit-scrollbar-track {
    background: white;
}

*::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);

    border: 0px solid white;
    /* creates padding around scroll thumb */
}

#wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    background-color: rgb(229, 229, 247);

    background-image: repeating-radial-gradient(circle at 0 0, transparent 0, #e5e5f7 10px), repeating-linear-gradient(rgba(242, 193, 139, 0.33), rgb(242, 193, 139, 0.4));

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

#header {
    flex: 1 1 50px;
    background-color: #f0f2f5;
}

#footer {
    bottom: 0;
    width: 100%;
}

#content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
    background-color: v-bind(chatBackground);
}

#listBox {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
}

.container {
    display: flex;
    flex-direction: horizontal;
    padding: 0px;
}

.avatarContainer {
    flex: 0 0 70px;
    padding: 5px 0px 5px 20px;
}

.avatar {
    width: 40px;
    height: 40px;

    background-color: lightgray;
    border-radius: 50%;
}

.content {
    width: 100%;
    padding: 0px 10px;

    color: #3b4a54;

    display: flex;
    width: 100%;
    flex-direction: column;

    user-select: none;

    overflow: hidden;
}

.contentHeader {
    margin-top: 8px;
    display: flex;
    /* background-color: aqua; */

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

.contentBody {
    /* background-color: aquamarine; */
    margin-top: 2px;
    margin-bottom: 3px;

    color: #111b21;
    font-size: small;
}

.iconContainer {
    padding: 12px 30px 12px 0px;
}

.iconContainer:hover {
    cursor: pointer;
}

.verticalLine {
    border-right: 1px solid rgb(200, 200, 200);
    height: 30px;
    margin: 10px 30px;
}
</style>