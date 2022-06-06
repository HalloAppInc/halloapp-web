<script setup lang="ts">

import { ref, computed } from 'vue'

const props = defineProps(['messageList'])

const inputMessage = ref('')

const inputArea = ref(<HTMLElement | null>(null))

// adjust the height of textArea
const inputAreaHeight = computed(() => {
    const regexp = new RegExp('[\n]', 'g')
    let match = [...inputMessage.value.matchAll(regexp)]
    // maximum number of line = 5
    if (match.length < 5) {
        return 41 + match.length * 18
    }
    else {
        return 41 + 4 * 18
    }
})

// format your message
function findAndReplace(msg: string, sign: string, htmlTagOpen: string, htmlTagClose: string) {
    const regexp = new RegExp('[' + sign + ']', 'g')
    let match = [...msg.matchAll(regexp)]
    // deal with \n
    if (sign === '\n') {
        var result = msg.replaceAll('\n', '<br>')
        return result  
    }
    // for others
    else if (match.length >= 2) {
        var indexFirst = match[0].index
        var indexSecond = match[match.length-1].index
        if (indexFirst !== undefined && indexSecond !== undefined) {
            var result = msg.substring(0, indexSecond) + htmlTagClose + msg.substring(indexSecond + 1);
            result = result.substring(0, indexFirst) + htmlTagOpen + result.substring(indexFirst + 1);
            return result
        }
    }
    return msg
}

function parseMessage(msg: string) {
    var result = findAndReplace(msg, '~', '<s>', '</s>')
    result = findAndReplace(result, '*', '<b>', '</b>')
    result = findAndReplace(result, '_', '<i>', '</i>')
    result = findAndReplace(result, '\n', '<br>', '')
    return result
}
 
function sendMessage() {
    console.log(inputAreaHeight.value, inputArea.value?.scrollHeight)
    if (inputMessage.value != '') {
        props.messageList.push({
            side: 'right',
            message: parseMessage(inputMessage.value),
            timestamp: '1649204213',
        })
        inputMessage.value = ''
    }
}


function nextLine() {
    inputMessage.value += '\n'
}

</script>

<template>
    <div class='chatBoxTray'>
        <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'face-smile']" size='2xl' />
        </div>
        <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'paperclip']" size='2xl' />
        </div>
        <div class='inputBoxContainer'>
            <textarea cols='85' v-model='inputMessage' class='input' placeholder='Type your message here...'
                @keydown.enter.exact.prevent='sendMessage' @keydown.shift.enter.exact.prevent='nextLine'
                ref='inputArea'></textarea>
        </div>
        <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'microphone']" size='2xl' />
        </div>
    </div>
</template>

<style scoped>
.chatBoxTray {
    background-color: #f0f2f5;
    display: flex;
    flex-direction: row;
    padding: 5px 10px 5px 10px;
    bottom: 0;
}

.iconContainer {
    padding: 10px 15px 10px 15px;
}

textarea {
    padding: 10px 15px;
    overflow-y: scroll;
    resize: vertical;
    height: v-bind(inputAreaHeight + 'px');
    text-align: left;

    background: #FFFFFF;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
    border-radius: 15px;
}

textarea:focus {
    outline: none;
}

.inputBoxContainer {
    padding: 5px 10px 0px 10px;
    display: inline-block;
}
</style>