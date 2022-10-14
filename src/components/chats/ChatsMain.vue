<script setup lang="ts">
    import { ref, computed, watch } from 'vue'

    import { useColorStore } from '../../stores/colorStore'

    import ChatHeader from './ChatHeader.vue'
    import ChatPanel from './ChatPanel.vue'
    import ChatFooter from './ChatFooter.vue'

    const colorStore = useColorStore()

    const replyQuoteIdx = ref({'value': -1})

    const chatBackground = computed(() => {
        return colorStore.chatBackground
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

    <div class='wrapper'>

        <!-- chat header with chatname chatinfo and settings -->
        <div class='header'>
            <ChatHeader/>
        </div>

        <!-- chatting area -->
        <div class='content'>
            <ChatPanel :replyQuoteIdx='replyQuoteIdx'/>
        </div>

        <!-- input tray -->
        <div class='footer'>
            <ChatFooter :replyQuoteIdx='replyQuoteIdx'/>
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