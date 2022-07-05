<script setup lang="ts">
import { ref, computed } from 'vue'

import { useHAText } from '../../composables/haText'
import { useColorStore } from '../../stores/colorStore'

const colorStore = useColorStore()

const { processText } = useHAText()

const props = defineProps(['messageList', 'contactList'])

const inputArea = ref(<HTMLElement | null>(null))
const chatBox = ref(<HTMLElement | null>(null))

// for input analyze
const inputMessage = ref(<string>'')
const inputMarkDownSign = ref('')
const cursorPosition = ref(0)
const contactPosition = ref(-1)
const showContacts = ref(false)
const disableUpdate = ref(false)

// for cursor position
const currentNode = ref(<Node | null>(null))
const nodeOffset = ref(0)

const chatBoxHeight = ref(0)

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

// deal with different keydown: enter, enter+shift, cmd+a, space, delete
function analyzeKeyDown(e: any) {
    // delete
    if (e.keyCode == 8) {
        // if inputbox is empty, clean all element inside
        // but due to webkit's bug, still can not clean <font> tag, need to detect it manually and delete it
        if (inputArea.value?.innerText == '') {
            inputArea.value?.innerHTML == ''
            return
        }
        // if delete mention <span>@contact</span>
        else {
            getCursorPosition()
            totalOffset = cursorPosition.value
            currentNode.value = null
            getChildNodeAndOffsetFromNestedNodes(inputArea.value, false)
            if (currentNode.value){
                const node = currentNode.value as HTMLElement
                if (node &&
                    node.parentElement?.nodeName == 'SPAN' &&
                    node.textContent?.includes('@')) {
                    if (nodeOffset.value == node.textContent.length) {
                        node.parentElement?.remove()
                        disableUpdate.value = true
                        e.preventDefault(e)
                    }
                }
            }
        }
    }
    // enter
    else if (e.keyCode == 13) {
        // shift + enter, new line
        if (e.shiftKey) {
            // if input box is empty, not allow to enter new line
            if (inputArea.value?.innerText.trim().length == 0) {
                e.preventDefault(e)
            }
        }
        // enter, send message
        else {
            sendMessage()
            e.preventDefault(e)
        }
    }
    // cmd + A, select all
    else if ((e.metaKey || e.ctrlKey) && e.keyCode == 65) {
        disableUpdate.value = true
    }
    // space
    else if (e.keyCode == 32) {
        // if input box is empty, not allow to enter space
        if (inputArea.value?.innerText.trim().length == 0) {
            e.preventDefault(e)
        }
    }
    // cmd + ` : ~
    else if (e.shiftKey && e.keyCode == 192) {
        inputMarkDownSign.value = '~'
    }
    // cmd + - : _
    else if (e.shiftKey && e.keyCode == 189) {
        inputMarkDownSign.value = '_'
    }
    // cmd + 8 : *
    else if (e.shiftKey && e.keyCode == 56) {
        inputMarkDownSign.value = '*'
    }
}

// send the text in input box
function sendMessage() {
    if (inputArea.value?.innerText.trim().length !== 0) {
        props.messageList.push({
            type: 'outBound',
            message: processText(inputArea.value?.innerText.trim(), props.contactList).html,
            timestamp: Date.now() / 1000 | 0, //  get current time
        })
        // clean text inside input box
        if (inputArea.value) {
            inputArea.value.innerText = ''
        }
    }
}

// for mouse movement
function analyzeMouseMovement(e: any) {
    // get cursor position
    getCursorPosition()

    // check if mention any contact
    checkContacts()
}

// check if the new input require update content or not
function needUpdate(inputChar: string) {
    let result = false
    // get the old and new input's HTML
    let newInputMessage = processText(inputArea.value?.innerText, props.contactList, false, 100, true).html
    let oldInputMessage = processText(inputMessage.value, props.contactList, false, 100, true).html

    // count pair of ~|*|_ and number of mention
    let numOfPairOldBTag = oldInputMessage.split('<b>').length - 1
    let numOfPairNewBTag = newInputMessage.split('<b>').length - 1
    let numOfPairOldITag = oldInputMessage.split('<i>').length - 1
    let numOfPairNewITag = newInputMessage.split('<i>').length - 1
    let numOfPairOldSTag = oldInputMessage.split('<s>').length - 1
    let numOfPairNewSTag = newInputMessage.split('<s>').length - 1
    let numOfMentionOld = oldInputMessage.split('<span style="color:#6495ED">@').length - 1
    let numOfMentionNew = newInputMessage.split('<span style="color:#6495ED">@').length - 1

    // get element at cursor's position
    currentNode.value = null
    totalOffset = cursorPosition.value
    getChildNodeAndOffsetFromNestedNodes(inputArea.value, false)

    // number of pair of ~|*|_ or mention changed, or maybe select area with ~|*|_ is replaced by new ~|*|_ 
    if (numOfPairOldBTag != numOfPairNewBTag || (inputChar == '*' && numOfPairOldBTag == numOfPairNewBTag && numOfPairOldBTag > 0) ||
        numOfPairOldITag != numOfPairNewITag || (inputChar == '_' && numOfPairOldITag == numOfPairNewITag && numOfPairOldITag > 0) ||
        numOfPairOldSTag != numOfPairNewSTag || (inputChar == '~' && numOfPairOldSTag == numOfPairNewSTag && numOfPairOldSTag > 0) ||
        numOfMentionOld != numOfMentionNew) {
        result = true
    }
    // change if input next to ~|*|_|mention or inside mention
    else if (currentNode.value) {
        // if in wrong font style because input inserted inside ~|*|_|mention's span
        const node = currentNode.value as HTMLElement
        if (node.parentElement) {
            if (node.parentElement?.nodeName == 'SPAN') {
                // update ~|*|_|mention's span to move the character outside of span
                result = (newInputMessage != oldInputMessage)
            }
        }
    }

    return result
}

// deal with different input, update content and move cursor
function analyzeKeyUp(e: any) {
    // get cursor position
    getCursorPosition()

    // check if mentioned any contact
    checkContacts()

    // if inputArea is empty, delete the remaining <span> and <div>
    if (inputArea.value && inputArea.value?.innerText.trim().length == 0) {
        inputArea.value.innerHTML = ''
        return
    }

    if (e.keyCode != 16 && // Shift
        e.keyCode != 91 && // left cmd on mac
        e.keyCode != 93 && // right cmd on mac
        e.keyCode != 37 && // ArrowLeft
        e.keyCode != 38 && // ArrowUp
        e.keyCode != 39 && // ArrowRight
        e.keyCode != 40) { // ArrowDown 
        if (!disableUpdate.value) {
            let inputChar: string
            // if input ~|*|_ 
            if (inputMarkDownSign.value) {
                inputChar = inputMarkDownSign.value
                inputMarkDownSign.value = ''
            }
            else {
                inputChar = e.key
            }
            // if need update
            if (needUpdate(inputChar)) {
                updateInputContent()
                updateCursorPosition()
            }
        }
        // reset it
        else {
            disableUpdate.value = false
        }
        // save the input text
        if (inputArea.value) {
            inputMessage.value = inputArea.value?.innerText
        }
    }
}

function updateCursorPosition(forAddMention: boolean = false) {
    let range = document.createRange()
    let sel = window.getSelection()
    totalOffset = cursorPosition.value
    currentNode.value = null
    nodeOffset.value = -1
    getChildNodeAndOffsetFromNestedNodes(inputArea.value)
    let node: Node
    let offset: number
    // normal situation
    if (currentNode.value) {
        node = currentNode.value
        offset = nodeOffset.value
        // if this is used for adding mention, move cursor one space after mention
        if (forAddMention) {
            node = node.parentNode?.nextSibling as Node// get next node
            offset = 1
        }
    }
    // if cursor is at front: currentNode.value == null 
    else {
        node = inputArea.value?.childNodes[0] as Node
        offset = 0
    }
    range.setStart(node, offset)
    range.collapse(true)
    if (sel) {
        sel.removeAllRanges()
        sel.addRange(range)
    }
}

function updateInputContent() {
    if (inputArea.value) {
        inputArea.value.innerHTML = processText(inputArea.value?.innerText, props.contactList, false, 100, true).html
    }
}

// get cursor position 
function getCursorPosition() {
    let element = document.querySelector('[contenteditable]')
    let sel = window.getSelection()
    let range = sel?.getRangeAt(0)
    let preCursorRange = range?.cloneRange()
    if (range && element && preCursorRange) {
        preCursorRange?.selectNodeContents(element)
        preCursorRange?.setEnd(range.endContainer, range.endOffset)
        cursorPosition.value = preCursorRange.toString().length
    }
}

// get number of line before cursor
function getCursorLine() {
    // our editable div
    const editable = document.getElementById('textarea') as Node
    if (editable.childNodes.length == 0) {
        return 1 // input is empty, count as 1 line
    }
    // collapse selection to end
    window.getSelection()?.collapseToEnd()
    const sel = window.getSelection()
    const range = sel?.getRangeAt(0)
    // select to top of editable
    if (editable.firstChild) {
        range?.setStart(editable.firstChild, 0)
    }
    const content = window.getSelection()?.toString()
    const text = JSON.stringify(content)
    const lines = (text.match(/\\n/g) || []).length + 1
    // clear selection
    window.getSelection()?.collapseToEnd()
    

    return lines
}

let totalOffset = 0
// get childnode idx and offset from cursorPosition
function getChildNodeAndOffsetFromNestedNodes(node: Node | null, countBR: boolean = true) {
    if (!node) {
        return
    }
    if (countBR && node.nodeName == 'BR') {
        if (totalOffset == 0) {
            currentNode.value = node
            nodeOffset.value = totalOffset
        }
    }
    // only count textnode
    if (node.nodeType == Node.TEXT_NODE) {
        let len = node.textContent?.length
        if (len != undefined && totalOffset > 0) {
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

// add contact after @
function addContactToInputBox(contact: string) {
    getCursorPosition()
    let numOfLine = getCursorLine()
    let newText = inputArea.value?.innerText.substring(0, contactPosition.value + (numOfLine - 1))
        + contact + inputArea.value?.innerText.substring(cursorPosition.value + (numOfLine - 1))
    let newHTML = processText(newText, props.contactList, false, 100, true).html
    if (inputArea.value) {
        inputArea.value.innerHTML = newHTML
        showContacts.value = false
        inputArea.value.focus()
        // update cursor position
        updateCursorPosition(true)
        // check if needs update after insertion
        getCursorPosition()
        needUpdate('click')
        inputMessage.value = inputArea.value.innerText
    }
}

// check if input after @ is in contact
function checkContacts() {
    contactPosition.value = -1
    if (inputArea.value) {
        const input = inputArea.value.innerText.replaceAll('\n', '')
        // cursor stops exactly at @
        if (chatBox.value && input[cursorPosition.value - 1] == '@') {
            chatBoxHeight.value = chatBox.value.clientHeight // update offset of contact list
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
                    if (chatBox.value && props.contactList[idx].includes(contact)) {
                        showContacts.value = true
                        chatBoxHeight.value = chatBox.value.clientHeight // update offset of contact list
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

    <div class='chatBoxTray' ref='chatBox'>
        <!-- <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'face-smile']" size='2x' />
        </div>
        <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'paperclip']" size='2x' />
        </div> -->
        <div class='inputBoxContainer'>
            <div id='textarea' ref='inputArea' contenteditable='true' placeholder='Type a message...'
                @keydown='analyzeKeyDown($event)' @keyup='analyzeKeyUp($event)' @click='analyzeMouseMovement($event)'>
            </div>
        </div>
        <!-- <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'microphone']" size='2x' />
        </div> -->
    </div>
</template>


<style scoped>
#textarea::-webkit-scrollbar {
    width: 25px;
}

#textarea::-webkit-scrollbar-track-piece:start {
    margin-top: 5px;
}

#textarea::-webkit-scrollbar-track-piece:end {
    margin-bottom: 5px;
}

#textarea::-webkit-scrollbar-track {
    box-shadow: inset 0 0 3px 3px transparent;
    border: solid 5px transparent;
}

#textarea::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 10px 10px #bbbbbe;
    border: solid 10px transparent;
    border-radius: 100px;
}

.chatBoxTray {
    background-color: v-bind(headerColor);
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

    background: v-bind(inBoundMsgBubbleColor);
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
    border-radius: 15px;

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