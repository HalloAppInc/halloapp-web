<script setup lang="ts">

import { ref, computed } from 'vue'

import { useHAText } from '../../composables/haText'

import { useColorStore } from '../../stores/colorStore'

const colorStore = useColorStore()

const { processText } = useHAText()

const props = defineProps(['messageList', 'contactList'])

const updateContent = ref(false)

const cursorPosition = ref(0)

const showContacts = ref(false)

const contactPosition = ref(-1)

const inputArea = ref(<HTMLElement | null>(null))

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

function sendMessage() {
    if (inputArea.value?.innerText.trim().length !== 0) {
        props.messageList.push({
            type: 'outBound',
            message: processText(inputArea.value?.innerText.trim(), props.contactList).html,
            timestamp: '1649204213',
        })
        if (inputArea.value) {
            inputArea.value.innerText = ''
        }
    }
}


// test if there are even number of */_/~ in input
function havePairOfMarkDown(input: string, sign: string) {
    let numOfOccurrence = input.split(sign).length - 1
    if (numOfOccurrence % 2 == 0) {
        return true
    }
    else {
        return false
    }
}


// if the input creates a new markdown sign pair, return true
function needUpdate() {
    let result = false

    // get input
    const input = inputArea.value?.innerText.replaceAll('\n', '')

    // get input char
    if (input && input[cursorPosition.value - 1] == '*') {
        result = havePairOfMarkDown(input, '*')
    }
    else if (input && input[cursorPosition.value - 1] == '_') {
        result = havePairOfMarkDown(input, '_')
    }
    else if (input && input[cursorPosition.value - 1] == '~') {
        result = havePairOfMarkDown(input, '~')
    }
    // the input position is next to <span style="color=gray">
    else {
        let { idx, offset } = getChildNodeIdxAndOffset()
        if (inputArea.value?.childNodes[idx].nodeName == 'SPAN') {
            result = true
        }
    }
    updateContent.value = result
}


// for keyDown delete, check if update is needed
function enterDelete() {

    // if inputbox is empty
    if (inputArea.value?.innerText == '') {
        return
    }

    let result = false
    const input = inputArea.value?.innerText.replaceAll('\n', '')
    if (input && input[cursorPosition.value - 1] == '*') {
        result = true//havePairOfMarkDown(input, '*')
    }
    else if (input && input[cursorPosition.value - 1] == '~') {
        result = true//havePairOfMarkDown(input, '~')
    }
    else if (input && input[cursorPosition.value - 1] == '_') {
        result = true//havePairOfMarkDown(input, '_')
    }

    updateContent.value = result
}


// get cursor position 
function getCursorPosition() {
    let element = document.querySelector('[contenteditable]')
    let sel = window.getSelection()
    if (sel) {
        let range = sel.getRangeAt(0)
        let preCursorRange = range.cloneRange()
        if (element) {
            preCursorRange.selectNodeContents(element)
        }
        preCursorRange.setEnd(range.endContainer, range.endOffset)
        // record it in cursorPosition
        cursorPosition.value = preCursorRange.toString().length
    }
}


// for keyUp, check if update is needed
function analyzeInput(e: any) {

    // get cursor position
    getCursorPosition()
    // check if mentioned any contacts
    checkContacts()

    // if inputbox is empty
    if (inputArea.value?.innerText == '') {
        return
    }

    // check if update innerHTML is needed
    if (e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 &&
        e.keyCode != 40 && e.keyCode != 16 && e.keyCode != 32 &&
        e.keyCode != 13 && e.keyCode != 8 && e.keyCode != 91 && e.keyCode != 93) {
        if (!updateContent.value) {
            needUpdate()
        }
    }

    // if need to update, show markdown 
    if (updateContent.value) {
        // update the input area
        if (inputArea.value) {
            inputArea.value.innerHTML = processText(inputArea.value?.innerText.trim(), props.contactList, false, 100, true).html
        }
        // set cursor to the end
        if (inputArea.value) {
            /* inputArea.value.childNodes.forEach((val, key) => {
                console.log(key, val, val.textContent?.length)
            }) */
            let range = document.createRange();
            let sel = window.getSelection()
            let { idx, offset } = getChildNodeIdxAndOffset()
            //console.log('in analyze input', idx, offset, inputArea.value.childNodes[idx].textContent)
            try { range.setStart(inputArea.value.childNodes[idx], offset) }
            catch (err: any) {
                console.log(err.message)
            }
            range.collapse(true)
            if (sel) {
                sel.removeAllRanges()
                sel.addRange(range)
            }
        }
        updateContent.value = false
    }

    // if inputArea is empty, delete the remaining <span> and <div>
    if (inputArea.value?.innerText == '') {
        inputArea.value?.innerHTML == ''
    }

}


// for mouse movement
function click() {
    // get cursor position
    getCursorPosition()
    // check if mension someone in contacts
    checkContacts()
}


// get childnode idx and offset from cursorPosition
function getChildNodeIdxAndOffset() {
    let idx = 0
    let offset = 0
    let totalOffset = cursorPosition.value
    let stop = false
    if (inputArea.value) {
        for (let i = 0; i < inputArea.value.childNodes.length; i++) {
            let node = inputArea.value.childNodes[i]
            if (node.textContent) {
                /* console.log('&',node.textContent,'totalL=',totalOffset) */
                if (totalOffset <= node.textContent.length) {
                    idx = i
                    offset = totalOffset
                    break
                }
                else {
                    totalOffset -= node.textContent.length
                    offset = node.textContent.length
                    idx = i
                }

                /* console.log('*', node.textContent, 'totalL=', totalOffset, 'L=',
                    node.textContent?.length, 'idx=', idx, node.nodeName,
                    stop, idx, offset) */
            }
        }
    }
    return { idx, offset }
}



function addContactToInputBox(contact: string) {
    if (inputArea.value) {
        let newText = inputArea.value.innerText.substring(0, contactPosition.value)
            + contact + inputArea.value.innerText.substring(cursorPosition.value) + ' '
        inputArea.value.innerHTML = processText(newText, props.contactList, false, 100, true).html
        showContacts.value = false
        inputArea.value?.focus()
    }

}


function checkContacts() {
    contactPosition.value = -1
    if (inputArea.value) {
        const input = inputArea.value.innerText.replaceAll('\n', '')
        // cursor stops exactly at @
        if (input[cursorPosition.value - 1] == '@') {
            showContacts.value = true
            contactPosition.value = cursorPosition.value
        }
        // cursor stops after @
        else {
            showContacts.value = false
            // check whether there exist an @
            let idx = input.indexOf('@')
            let idx_old = -1
            while (idx > -1 && idx < cursorPosition.value) {
                idx_old = idx
                idx = input.indexOf('@', idx_old + 1);
            }
            if (idx_old != -1) {
                let contact = input.substring(idx_old + 1, cursorPosition.value)
                // if this contact is in contactList
                for (idx = 0; idx < props.contactList.length; idx++) {
                    if (props.contactList[idx].includes(contact)) {
                        showContacts.value = true
                        break
                    }
                }
                contactPosition.value = idx_old + 1
            }
        }

    }

}

</script>

<template>
    <div class='contactList' v-if='showContacts'>
        <div id='listBox'>
            <div v-for='(value, idx) in contactList' class='container' @click='addContactToInputBox(value)'>
                <div class='avatarContainer'>
                    <div class='avatar'></div>
                </div>
                <div class='content' :class="{ 'contentLastElement': idx == contactList.length - 1 }">
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
            <div id='textarea' ref='inputArea' contenteditable='true' @keydown.enter.exact.prevent='sendMessage()'
                @keydown.delete='enterDelete()' @keyup='analyzeInput($event)' @click='click()'>
            </div>
            <!-- <textarea id='textarea' v-model='inputMessage' class='input'
                placeholder='Type your message here...' 
                @keydown.enter.exact.prevent='sendMessage'
                @keydown.shift.enter.exact.prevent='nextLine' 
                @keyup='analyzeInput($event)'
                @click='analyzeInput($event)' 
                ref='inputArea'>
                </textarea> -->
        </div>
        <!-- <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'microphone']" size='2x' />
        </div> -->
    </div>
</template>


<style scoped>
.chatBoxTray {
    background-color: #f0f2f5;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 5px 10px 5px 10px;
    bottom: 0;
}

.iconContainer {
    padding: 10px 15px;
}

#textarea {
    width: 100%;
    padding: 10px 15px;
    overflow-y: scroll;
    resize: none;
    max-height: 110px;
    text-align: left;

    background: #FFFFFF;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
    border-radius: 15px;

    caret-color: v-bind(cursorColor);
    color: v-bind(textColor);
}

#textarea:focus {
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