<script setup lang="ts">

import { ref, computed, watch } from 'vue'

import InputBox from './InputBox.vue'
import ChatBubble from './ChatBubble.vue'
import { useColorStore } from '../../stores/colorStore';

const colorStore = useColorStore()

const content = ref<HTMLElement | null>(null)

const messageList = ref([
    {
        side: "middle",
        message: "",
        timestamp: "1649204213",
    },
    {
        side: "left",
        message: "Short text testing:<br> ~123~ <s>123</s>,_123_<i>123</i>,*123*<b>123</b>",
        timestamp: "1649204213",
    },
    {
        side: "right",
        message: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
        timestamp: "1649204213",
    },
    {
        side: "left",
        message: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
        timestamp: "1649204213",
    }
])

const messageNumber = computed(() => {
    return messageList.value.length
})

watch(messageNumber, () => {
    content.value?.scrollTo(10000, content.value?.clientHeight)
})

const chatBackground = computed(() => {
    return colorStore.chatBackground
})
</script>

<template>

    <div id="wrapper">

        <div id="header">
        </div>

        <!-- chatting area -->
        <div id='content' ref='content'>
            <ChatBubble :message-list='messageList'/>
        </div>

        <!-- input tray -->
        <div id='footer'>
            <InputBox :message-list='messageList'/>
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
    background-color: v-bind(chatBackground);
}
</style>