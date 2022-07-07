<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

import InputBox from './InputBox.vue'

const colorStore = useColorStore()
const mainStore = useMainStore()

const props = defineProps(['uploadFiles', 'messageList', 'contactList'])

const attachMediaList = ref(<any>[])

const test = ref()

const messageNumber = computed(() => {
    return props.messageList.length
})

const mediaUrlList = computed(() => {
    const result = []
    for (let i = 0; i < props.uploadFiles.length; i++) {
        result.push(URL.createObjectURL(props.uploadFiles[i]))
    }
    return result
})

// if message is sent, close preview
watch(messageNumber, (newVal, oldVal) => {
    mainStore.gotoChatPage('')
})

const backgroundColor = computed(() => {
    return colorStore.background
})
const wraperColor = computed(() => {
    return colorStore.wraper
})
const shadowColor = computed(() => {
    return colorStore.shadow
})
const iconColor = computed(() => {
    return colorStore.icon
})

async function sendMediaToServer() {
    const putUrl = `https://us-e-halloapp-media.s3-accelerate.dualstack.amazonaws.com/ZDg0YjI1ODQtZmQ3My0xMWVjLWE2NGYtMTIyNDZjYWZiNjcz?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAVF4QDF4XNVQY4HH4%2F20220706%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220706T213733Z&X-Amz-Expires=604800&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIEKta%2FC8MD9nzLs5F2CkiMt9Rc9pHB%2Fo469AR5eHcJ4jAiEAku8eU3PUz%2BUOTgz6pUqQfhoX1qNUsUtooG1X%2FTpTS3Qq3AQIw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgwzNTYyNDc2MTMyMzAiDJWPckzVa7OnZhvWzyqwBN6e8dRyvGbOPbHq%2FKL0eIZSCCsNEMWvSsVP5%2BigyaXfqA4i8GuqqVp8t%2FEz6zG5W9Y1ADZ0tWKCwPfJ1BPlUXcSmD0tnkF5groXYzqEw1tIU7QuoBTzt%2BsI3YjaqHnY00PiscdJk5GoyG%2FrBhLpBW7tXqV9mEowUZu6KGXiR6UwPxx8lx4XauVxrZrfQWpb6KR%2FAHRsvniSHcQDvHwr8P%2FnCvweCvyJdFRZECs5xGQBcYyfPb2nnWl08dUEaNBiW138fR%2F6jAk7YC%2BNyseP%2B4kSaIohAuROeawa3%2FHjJVuPffD1UTtqsjq2xPgc6Qk5WNoVmU8Y%2B1OXpmHYoCEeTSIxQCXLnFz%2FLa8UXppb9mZw9ieaKv8buS8nWzm3kY1stZT94nNwf2XDc02P94o1GSCZSXo20un2kzwhZ07ZNebPajGKYpzrBFpqe53wYDoo3CaFjgREJ1HQ1%2Bjon6TElAAC7vw6vWd0fUMDzMpLKIqIePOWou0BP1czo16O06lX%2BeoERfZSdul9Iko7qwGgAV%2FGJl87zOhJLnEnJlqTiUpTlHB1tII4Vyx26jUDYhw75%2BCYqU%2F0kzf2Ht3AwPg2%2FyDCRKnAvPX9gqoefTg9CZCj6xsbyQ%2BszDG3rWVqMn2%2F28l1R2mQO76L8cpnHuHcIy8eQO8Qk5%2FoO%2Fj3xd7Ij81bX%2BK703OL0vC8Fx8XLKGaxfIVnqyMK6YQH2f%2B26Cp8krR3RZH0HlwIpL0xwIlZlErMNGSl5YGOqkBeRNaop3GsneqDP4LEpTiiuWnALLWskG%2FXaLtiuAuLvR0lWfh6cbS8Gpbmz9iMdmD6GsTq27ulo22ppDsYyP9bW1dSxaYS2pvRMAKVVIXu1LcnXpyA%2BweV0AtOPIMmQt36Hfe9j0dxrafs4e%2BkjXPO9L6%2BjuXATdPWO0nw975KFZNiXUlmJs2eTb1xiR3pWq7dz4nQ%2FzD%2FqEq8%2Bg56pTevlEtyOBM25Ygfw%3D%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=71c2b0451e61e4f3b90da3492317157ac5089f2a7001589eae3b5b35c74f969f`
    console.log('upload file size', props.uploadFiles[0].size)

    let response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + putUrl,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: props.uploadFiles[0]
        })
        .then(response => {
            console.log('PUT status =', response.status)
        })

    // keep trying while succeed
    /* while (response.status !== 200) {
        let response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + putUrl,
            {
                method: 'PUT',
                body: props.uploadFiles[0]
            }).then(response => {
                console.log(response.status)
            })
    } */
}

async function getMediaFromServer() {
    const getUrl = `https://u-cdn.halloapp.net/ZDg0YjI1ODQtZmQ3My0xMWVjLWE2NGYtMTIyNDZjYWZiNjcz`

    const request = new Request(mainStore.devCORSWorkaroundUrlPrefix + getUrl)
    const response = await fetch(request)
    
    let mediaBlob: Blob = await response.blob()
    console.log('download file size', mediaBlob.size)
    const mediaBlobUrl = URL.createObjectURL(mediaBlob)
    attachMediaList.value.push(mediaBlobUrl)

    /* while (response.status !== 200) {
        let response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + getUrl,
            {
                method: 'GET',
            })
            .then(response => response.blob())
            .then(function (myBlob) {
                var objectURL = URL.createObjectURL(myBlob)
                attachMediaList.value.push(url)
            })
    } */
}

async function uploadAndDownLoad() {
    await sendMediaToServer()
    await getMediaFromServer()
    console.log("1", attachMediaList.value[0])
    test.value.src = attachMediaList.value[0]
}
</script>

<template>

    <div id='mask' v-if='mainStore.chatPage == "preview"'>
        <div id='wrapper'>
            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click="mainStore.gotoChatPage('chat')">
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
                    </div>
                </div>
            </div>

            <!-- tool box: edit uploaded photo -->
            <div id='header'>
                <!-- test upload and download -->
                <div class='iconContainer' @click='uploadAndDownLoad'>
                    <div class='iconShadow'>
                        <font-awesome-icon :icon="['fas', 'face-smile']" size='lg' />
                    </div>
                </div>
                <img ref='test' />
            </div>

            <!-- image box: show the image -->
            <div id='content'>
                <div class='imgContainer'>
                    <img :src='mediaUrlList[0]' />
                </div>
            </div>

            <!-- input box: add caption -->
            <div id='footer'>
                <div class='chatBoxTray' ref='chatBox'>
                    <InputBox :message-list='messageList' :contact-list='contactList'
                        :upload-files='mediaUrlList[0]'/>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
#mask {
    position: fixed;
    z-index: 4;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: v-bind(wraperColor);
    display: table;
}

#wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    background-color: v-bind(wraperColor);

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.closeIconContainer {
    position: fixed;
    top: 0px;
    left: 0px;
}

.iconContainer {
    margin: 20px;
    color: v-bind(iconColor);
}

.iconContainer:hover {
    cursor: pointer;
}

#header {
    flex: 1 1 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

#content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

img {
    background-color: v-bind(backgroundColor);
    box-shadow: 0px 0px 20px 2px v-bind(shadowColor);
}

#footer {
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.chatBoxTray {
    width: 500px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: row;
}
</style>