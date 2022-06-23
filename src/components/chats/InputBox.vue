<script setup lang="ts">

import { ref, computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'
import { useHAText } from '../../composables/haText'

const colorStore = useColorStore()
const { processText } = useHAText()

const props = defineProps(['messageList', 'contactList'])

const inputMessage = ref('')

const showContacts = ref(false)

const contactPosition = ref(-1)

const cursorPosition = ref(0)

const inputArea = ref(<HTMLElement | null>(null))

const headerColor = computed(() => {
    return colorStore.header
})

const inBoundMsgBubbleColor = computed(() => {
    return colorStore.inBoundMsgBubble
})

const cursorColor = computed(() => {
    return colorStore.cursor
})

const textColor = computed(() => {
    return colorStore.text
})

const backgroundColor = computed(() => {
    return colorStore.background
})

const lineColor = computed(() => {
    return colorStore.line
})

const hoverColor = computed(() => {
    return colorStore.hover
})

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

function sendMessage() {
    if (inputMessage.value != '') {
        props.messageList.push({
            type: 'outBound',
            message: processText(inputMessage.value, props.contactList),
            timestamp: '1655862547',
        })
        inputMessage.value = ''
    }
}

function nextLine() {
    inputMessage.value += '\n'
}

function analyzeInput(e: any) {
    cursorPosition.value = e.target.selectionStart
    contactPosition.value = -1
    // cursor stops after @
    if (inputMessage.value[cursorPosition.value - 1] == '@') {
        showContacts.value = true
        contactPosition.value = cursorPosition.value
    }
    else {
        showContacts.value = false
        // check whether there exist an @
        let idx = inputMessage.value.indexOf('@')
        let idx_old = -1
        while (idx > -1 && idx < cursorPosition.value) {
            idx_old = idx           
            idx = inputMessage.value.indexOf('@', idx_old + 1);
        }
        if (idx_old != -1) {
            let contact = inputMessage.value.substring(idx_old+1, cursorPosition.value)
            // if this contact is in contactList
            for(idx = 0; idx < props.contactList.length; idx++) {
                if (props.contactList[idx].includes(contact)) {
                    showContacts.value = true
                    break
                }
            }
            contactPosition.value = idx_old + 1
        }
    }
}

function addContactToInputBox(contact: string) {
    inputMessage.value = inputMessage.value.substring(0,contactPosition.value) 
                        + contact + inputMessage.value.substring(cursorPosition.value) + ' '
    showContacts.value = false
    inputArea.value?.focus()
}
</script>

<template>
    <div class='contactList' v-if='showContacts'>
        <div id='listBox'>
            <div v-for='(value, idx) in contactList' class='container' @click='addContactToInputBox(value)'>
                <div class='avatarContainer'>
                    <div class='avatar'></div>
                </div>
                <div class='content' :class="{'contentLastElement': idx == contactList.length-1}">
                    <div class='contentHeader'>
                        <div class='contentTitle'>
                            {{ value }}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class='chatBoxTray'>
        <!-- <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'face-smile']" size='2x' />
        </div>
        <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'paperclip']" size='2x' />
        </div> -->
        <div class='inputBoxContainer'>
            <textarea id='textarea' v-model='inputMessage' class='input'
                placeholder='Type your message here...' 
                @keydown.enter.exact.prevent='sendMessage'
                @keydown.shift.enter.exact.prevent='nextLine' 
                @keyup='analyzeInput($event)'
                @click='analyzeInput($event)' 
                ref='inputArea'>
                </textarea>
        </div>
        <!-- <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'microphone']" size='2x' />
        </div> -->
    </div>
</template>

<style scoped>
.chatBoxTray {
    background-color: v-bind(headerColor);
    display: flex;
    flex-direction: row;
    padding: 5px 10px 5px 10px;
    bottom: 0;
}

.iconContainer {
    padding: 10px 15px;
}

textarea {
    width: 100%;
    min-width: 0;
    padding: 10px 15px;
    overflow-y: scroll;
    resize: none;
    height: v-bind(inputAreaHeight + 'px');
    text-align: left;

    background: v-bind(inBoundMsgBubbleColor);
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
    border-radius: 15px;

    caret-color: v-bind(cursorColor);
    color: v-bind(textColor);
}

textarea:focus {
    outline: none;
}

.inputBoxContainer {
    width: 100%;
    margin: 5px 5px;
    display: flex;
}

.contactList {
    background-color: #f0f2f5;
    border-bottom: 1px solid v-bind(lineColor);
}

#listBox {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    background-color: v-bind(backgroundColor);
}

.container {
    display: flex;
    flex-direction: horizontal;
    padding: 0px;
}
.container:hover {
    background-color: v-bind(hoverColor);
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
    border-bottom: 1px solid v-bind(lineColor);

    color: #3b4a54;

    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;

    user-select: none;

    overflow: hidden;
}

.contentLastElement {
    border-bottom: 0px;
}

.contentHeader {
    display: flex;
    
    justify-content: flex-start;
}

.contentTitle {
    color: v-bind(textColor);
    font-weight: 600; 

    flex: 1 1 auto;
    vertical-align: middle;

    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap; 

    user-select: none;

    overflow: hidden;
}
</style>