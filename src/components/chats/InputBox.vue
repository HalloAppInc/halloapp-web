<script setup lang="ts">
import { ref, computed } from 'vue'

import { useHAText } from '../../composables/haText'

import { useColorStore } from '../../stores/colorStore'

const colorStore = useColorStore()

const { processText } = useHAText()

const props = defineProps(['messageList', 'contactList'])

const inputMessage = ref('')

const updateContent = ref(false)

const cursorPosition = ref(0)

const showContacts = ref(false)

const selectAllFromInputBox = ref(false)

const contactPosition = ref(-1)

const inputArea = ref(<HTMLElement | null>(null))

const chatBox = ref(<HTMLElement | null>(null))

const currentNode = ref(<Node | null>(null))

const nodeOffset = ref(0)

const chatBoxHeight = ref(0)

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
            timestamp: Date.now() / 1000 | 0, //  get current time
        })
        if (inputArea.value) {
            inputArea.value.innerText = ''
        }
    }
}


// test if there are even number of ~|_|* in input
function havePairOfMarkDownOrNextToMarkDown(input: string, sign: string) {
    let numOfOccurrence = input.split(sign).length - 1
    const signList = ['*', '~', '-', '@']
    if (numOfOccurrence % 2 == 0) {
        return true
    }
    // if input ~|_|* is next to ~|_|*
    else if (signList.includes(input[cursorPosition.value - 2]) || 
        signList.includes(input[cursorPosition.value])) {
        return true
    }
    return false
}


// if the input creates a new markdown sign pair, return true
function needUpdate(inputChar: string) {
    let result = false
    const signList = ['*', '~', '_', '@']
    const keyList = ['`', '8', '-', '2']
    // get input and input character
    const input = inputArea.value?.innerText.replaceAll('\n', '')!
    if (signList.includes(input[cursorPosition.value - 1]) && keyList.includes(inputChar)) {
        inputChar = input[cursorPosition.value - 1]
    }

    totalOffset = cursorPosition.value
    currentNode.value = null
    getChildNodeAndOffsetFromNestedNodes(inputArea.value!, false)
    // console.log('in needUpdate:', currentNode.value, currentNode.value!.parentElement!.nodeName)

    // if input is ~|_|*
    if (inputChar == '*') {
        result = havePairOfMarkDownOrNextToMarkDown(input, '*')
    }
    else if (inputChar == '_') {
        result = havePairOfMarkDownOrNextToMarkDown(input, '_')
    }
    else if (inputChar == '~') {
        result = havePairOfMarkDownOrNextToMarkDown(input, '~')
    }
    // if cmd + A select all the text in input box, do not update content
    else if (selectAllFromInputBox.value == true) {
        selectAllFromInputBox.value = false
        result = false
    }
    else if (currentNode.value!.parentElement!.nodeName == 'SPAN') {
        result = true
    }
    // the input position is next to <span style="color=gray">
    /* else if (signList.includes(input[cursorPosition.value - 2]) || 
        signList.includes(input[cursorPosition.value])) {
        result = true
    } */
    else {
        // chrome will automatically add a <font> to wrap the new input,
        // if the deleted one starts with a valid markdown sign ~|*|_.
        // delete the <font> by reparse the input text and update content.
        for(let i = 0; i < inputArea.value!.childNodes.length; i++) {
            if (inputArea.value!.childNodes[i].nodeName == 'FONT') {
                console.log('bug!')
                result= true
                break
            }
        }
    }

    updateContent.value = result
}


function enterDelete(e: any) {
    // if inputbox is empty
    if (inputArea.value?.innerText == '') {
        inputArea.value?.innerHTML == ''
        return
    }
    let result = false
    const input = inputArea.value?.innerText.replaceAll('\n', '')!
    if (input[cursorPosition.value - 1] == '*') {
        result = true // havePairOfMarkDown(input, '*')
    }
    else if (input[cursorPosition.value - 1] == '~') {
        result = true // havePairOfMarkDown(input, '~')
    }
    else if (input[cursorPosition.value - 1] == '_') {
        result = true // havePairOfMarkDown(input, '_')
    }
    else if (input[cursorPosition.value - 1] == '@') {
        result = true // havePairOfMarkDown(input, '_')
    }
    // delete <span> @contact </span>
    else {
        totalOffset = cursorPosition.value
        getChildNodeAndOffsetFromNestedNodes(inputArea.value!)
        if (currentNode.value &&
            currentNode.value!.parentElement!.nodeName == 'SPAN' &&
            currentNode.value!.textContent!.includes('@')) {
            if (nodeOffset.value == currentNode.value!.textContent!.length) {
                currentNode.value!.parentElement?.remove()
                e.preventDefault(e)
            }
            else {
                result = true
            }
        }
    }
    updateContent.value = result
}

// for keyDown delete, check if update is needed
/* function enterDelete(e: any) {
    // if inputbox is empty
    if (inputArea.value!.innerText.trim().length == 0) {
        inputArea.value!.innerHTML = ''
        return
    }

    let result = true
    totalOffset = cursorPosition.value
    currentNode.value = null
    getChildNodeAndOffsetFromNestedNodes(inputArea.value!, false)
    console.log('in eneterDelete:', currentNode.value, nodeOffset.value)
    // delete <span> @contact </span>
    if (currentNode.value!.parentElement!.nodeName == 'SPAN' &&
        currentNode.value!.textContent!.includes('@')) {
        if (nodeOffset.value == currentNode.value!.textContent!.length) {
            currentNode.value!.parentElement?.remove()
            e.preventDefault(e)
            result = false
        }
        // if delete middle character in mention, do not delete the whole span
    }

    updateContent.value = true
} */


// block first character to be space
function enterSpace(e: any) {
    // if inputArea is empty, do not allow to enter space
    if (inputArea.value!.innerText.trim().length == 0) {
        e.preventDefault(e)
    }
}


// block first character to be enter
function enterShiftEnter(e: any) {
    // if inputArea is empty, do not allow to enter another line
    if (inputArea.value!.innerText.trim().length == 0) {
        e.preventDefault(e)
    }
}


// get cursor position 
function getCursorPosition() {
    let element = document.querySelector('[contenteditable]')!
    let sel = window.getSelection()!
    let range = sel.getRangeAt(0)
    let preCursorRange = range.cloneRange()
    preCursorRange.selectNodeContents(element)
    preCursorRange.setEnd(range.endContainer, range.endOffset)
    cursorPosition.value = preCursorRange.toString().length
}


// get number of line before cursor
function getCursorLine() {
    // our editable div
    const editable = document.getElementById('textarea')! as Node
    if (editable.childNodes.length == 0) {
        return 1
    }
    // collapse selection to end
    window.getSelection()!.collapseToEnd()
    const sel = window.getSelection()!
    const range = sel.getRangeAt(0)
    // select to top of editable
    range.setStart(editable.firstChild!, 0)
    // do not use 'this' sel anymore since the selection has changed
    const content = window.getSelection()!.toString()
    const text = JSON.stringify(content)
    const lines = (text.match(/\\n/g) || []).length + 1

    // clear selection
    window.getSelection()!.collapseToEnd()
    return lines
}


// for keyUp, check if update is needed
function analyzeInput(e: any) {

    // get cursor position
    getCursorPosition()

    // check if mentioned any contacts
    checkContacts()

    // if inputArea is empty, delete the remaining <span> and <div>
    if (inputArea.value!.innerText.trim().length == 0) {
        inputArea.value!.innerHTML = ''
        return
    }
    
    // check if update innerHTML is needed, do not respond to these keys
    if (!updateContent.value &&
        e.keyCode != 8 && // backspace
        e.keyCode != 13 && // Enter
        e.keyCode != 16 && // Shift
        e.keyCode != 37 && // ArrowLeft
        e.keyCode != 38 && // ArrowUp
        e.keyCode != 39 && // ArrowRight
        e.keyCode != 40 && // ArrowDown
        e.keyCode != 91 // cmd on mac
        /* e.keyCode != 93 */// select key (Context Menu)
        ) {
        needUpdate(e.key)
    }

    console.log('enter key=',e.key,'need update?=',updateContent.value)

    // if need to update, show markdown 
    if (updateContent.value){
        // update the input area
        if (inputArea.value) {
            inputArea.value.innerHTML = processText(inputArea.value?.innerText, props.contactList, false, 100, true).html
        }
        // set cursor to the end
        if (inputArea.value) {
            let range = document.createRange()
            let sel = window.getSelection()
            totalOffset = cursorPosition.value
            currentNode.value = null
            nodeOffset.value = -1
            getChildNodeAndOffsetFromNestedNodes(inputArea.value)
            // console.log("in Analysis", nodeOffset.value, currentNode.value)
            if (currentNode.value) {
                range.setStart(currentNode.value!, nodeOffset.value)
                range.collapse(true)
                if (sel) {
                    sel.removeAllRanges()
                    sel.addRange(range)
                }
            }
        }
        updateContent.value = false
    }

    inputMessage.value = inputArea.value!.innerText
    console.log(inputMessage.value)
}


// for mouse movement
function click() {
    // get cursor position
    getCursorPosition()

    // check if mention someone in contacts
    checkContacts()
}



let totalOffset = 0
// get childnode idx and offset from cursorPosition
function getChildNodeAndOffsetFromNestedNodes(node: Node, countBR: boolean = true) {
    if (countBR && node.nodeName == 'BR') {
        if (totalOffset == 0) {
            currentNode.value = node
            nodeOffset.value = totalOffset
        }
    }
    // only count textnode
    if (node.nodeType == Node.TEXT_NODE) {
        let len = node.textContent!.length
        // console.log(node, totalOffset, len, currentNode.value?.parentElement)
        if (totalOffset > 0) {
            if (totalOffset <= len) {
                currentNode.value = node
                nodeOffset.value = totalOffset
                totalOffset -= len
            }
            else {
                totalOffset -= len
            }
        }
    }
    else {
        let nodeNextChild = node.firstChild
        while (nodeNextChild) {
            getChildNodeAndOffsetFromNestedNodes(nodeNextChild, countBR)
            nodeNextChild = nodeNextChild.nextSibling
        }
    }
}


function addContactToInputBox(contact: string) {
    if (inputArea.value) {
        let numOfLine = getCursorLine()
        // if cursor is at the end of text, add &nbsp after mention
        if (inputArea.value.innerText.length - (numOfLine - 1) == contactPosition.value) {
            let newText = inputArea.value.innerText.substring(0, contactPosition.value + (numOfLine - 1)) + contact
            inputArea.value.innerHTML = processText(newText, props.contactList, false, 100, true).html + '&nbsp;'
        }
        // if cursor is at the middle of text, add space after mention
        else {
            let newText = inputArea.value.innerText.substring(0, contactPosition.value + (numOfLine - 1))
            + contact + ' ' + inputArea.value.innerText.substring(cursorPosition.value + (numOfLine - 1))
            inputArea.value.innerHTML = processText(newText, props.contactList, false, 100, true).html
        }
        showContacts.value = false
        inputArea.value?.focus()

        // update cursor position
        let range = document.createRange();
        let sel = window.getSelection()
        // get current child node
        totalOffset = cursorPosition.value
        getChildNodeAndOffsetFromNestedNodes(inputArea.value)
        let childnode = currentNode.value?.parentNode?.nextSibling! // get next node
        /* inputArea.value.childNodes.forEach((val, key) => {
            console.log(key, val, val.textContent?.length)
        } */
        range.setStart(childnode, 1)
        range.collapse(true)
        if (sel) {
            sel.removeAllRanges()
            sel.addRange(range)
        }
    }

}


function checkContacts() {
    contactPosition.value = -1
    if (inputArea.value) {
        const input = inputArea.value.innerText.replaceAll('\n', '')
        // cursor stops exactly at @
        if (input[cursorPosition.value - 1] == '@') {
            chatBoxHeight.value = chatBox.value!.clientHeight // update offset of contact list
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
                        chatBoxHeight.value = chatBox.value!.clientHeight // update offset of contact list
                        break
                    }
                }
                contactPosition.value = idx_old + 1
            }
        }

    }

}

function selectAll() {
    selectAllFromInputBox.value = true
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

    <div class='chatBoxTray' ref='chatBox'>
        <!-- <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'face-smile']" size='2x' />
        </div>
        <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'paperclip']" size='2x' />
        </div> -->
        <div class='inputBoxContainer'>
            <div id='textarea' ref='inputArea' contenteditable='true' placeholder='Type a message...'
                @keydown.enter.exact.prevent='sendMessage()' 
                @keydown.shift.enter="enterShiftEnter($event)"
                @keydown.delete="enterDelete($event)"
                @keydown.space="enterSpace($event)" @keyup='analyzeInput($event)'
                @keydown.a.meta='selectAll()'
                @click='click()'>
            </div>
        </div>
        <!-- <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'microphone']" size='2x' />
        </div> -->
    </div>
</template>


<style scoped>

#textarea::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

#textarea::-webkit-scrollbar-track-piece:start {
    background: transparent;
    margin-top: 5px;
}

#textarea::-webkit-scrollbar-track-piece:end {
    background: transparent;
    margin-bottom: 5px; 
}

#textarea::-webkit-scrollbar-track {
    background: transparent;        /* color of the tracking area */
}

#textarea::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);    /* color of the scroll thumb */
    border-radius: 5px;
    border: 0px solid transparent;  /* creates padding around scroll thumb */
}

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
    overflow-y: auto;
    resize: none;
    max-height: 110px;
    text-align: left;

    background: #FFFFFF;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
    border-radius: 15px;
    border-right: 5px solid transparent;

    caret-color: v-bind(cursorColor);
    color: v-bind(textColor);
}

#textarea:focus {
    outline: none;
}

[contenteditable][placeholder]:empty:before {
    content: attr(placeholder);
    position: absolute;
    color: gray;
    background-color: transparent;
}

.inputBoxContainer {
    width: 100%;
    margin: 5px 5px;
    display: flex;
}

.contactList {
    position: fixed;
    width: 100%;
    height: fit-content;
    max-height: 300px;
    bottom: v-bind(chatBoxHeight + 'px');
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