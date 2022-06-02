<script setup lang="ts">

import { ref, computed, watch } from 'vue'

const content = ref<HTMLElement | null>(null)

const inputMessage = ref('')

const messageList = ref([
    {
        side: "middle",
        message: "",
        timestamp: "12:00 pm",
    },
    {
        side: "left",
        message: "Short text testing",
        timestamp: "12:00 pm",
    },
    {
        side: "right",
        message: "Long text tesing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
        timestamp: "12:10 pm",
    },
    {
        side: "left",
        message: "Long text tesing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
        timestamp: "12:10 pm",
    }
])

// get current time for timestamp
function formatAMPM() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutes = Number(('0' + minutes).slice(-2))
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function sendMessage() {
    if (inputMessage.value != '') {
        messageList.value.push({
            side: "right",
            message: inputMessage.value,
            timestamp: formatAMPM(),
        })
        inputMessage.value = ''
    }
}

const messageNumber = computed(() => {
    return messageList.value.length
})

watch(messageNumber, () => {
    content.value?.scrollTo(10000, content.value?.clientHeight)
})

</script>

<template>

    <div id="wrapper">

        <div id="header">
        </div>

        <!-- chatting area -->
        <div id="content" ref="content" onresize="scrollToBottom">
            <div class="containerChat" v-for="value in messageList">
                <div class="contentTextBody" :class="'contentTextBody-' + value.side">
                    <div class="chat-bubble" :class="'chat-bubble-' + value.side">
                        <div class="chatTextContainer" v-if="value.side != 'middle'">
                            {{ value.message }}
                        </div>
                        <div :class="'timestampContainer-' + value.side">
                            <div class="timestamp">
                                {{ value.timestamp }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- input tray -->
        <div id="footer">
            <div class="chat-box-tray">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'face-smile']" size="2xl" />
                </div>
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'paperclip']" size="2xl" />
                </div>
                <div class="inputBoxContainer">
                    <input type="text" v-model="inputMessage" class="input" placeholder="Type your message here..."
                        size="85" v-on:keyup.enter="sendMessage">
                </div>
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'microphone']" size="2xl" />
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

    border-left: 1px solid #b8b7b7;

    background-color: rgb(229, 229, 247);

    background-image: repeating-radial-gradient(circle at 0 0, transparent 0, #e5e5f7 10px), repeating-linear-gradient(rgba(242, 193, 139, 0.33), rgb(242, 193, 139, 0.4));

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

#header {
    flex: 1 1 50px;
    background-color: #f0f2f5;
    padding: 10px;
}

#footer {
    bottom: 0;
    width: 100%;
}

#content {
    width: calc(100% - 50px);
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
    background-color: rgba(242, 193, 139, 0.33);
}

.containerChat {
    display: flex;
    flex-direction: column;
    padding: 0px;
}

.contentTextBody {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.contentTextBody-left {
    justify-content: flex-start;
}

.contentTextBody-right {
    justify-content: flex-end;

}

.contentTextBody-middle {
    justify-content: center;
}

.chat-bubble {
    padding: 10px 14px;
    margin: 10px 30px;
    border-radius: 9px;
    /* animation: fadeIn 1s ease-in; */
    position: relative;
    box-shadow: -2px 2px 5px #b8b7b7;
    width: fit-content;
    max-width: 50%;
}

/* .chat-bubble:hover {
    cursor: default;
} */

.chat-bubble-left {
    background: #FFFFFF;
}

.chat-bubble-right {
    background: #74b9ff;
}

.chat-bubble-middle {
    background: #FFFFFF;
}

.chatTextContainer {
    color: #000000;
}

.chat-box-tray {
    background-color: #f0f2f5;
    display: flex;
    align-items: baseline;
    padding: 10px 15px;
    align-items: center;
    bottom: 0;
}

.iconContainer {
    padding: 5px 20px 5px 20px;
}

.input {
    line-height: 2em;
}

.inputBoxContainer {
    padding: 5px 15px 5px 15px;
    line-height: 20px;
    display: inline-block;
}

.timestampContainer {
    flex-direction: row;
}

.timestampContainer-left {
    text-align: left;
}

.timestampContainer-right {
    text-align: right;
}

.timestamp {
    font-size: small;
    color: #404040;
}
</style>