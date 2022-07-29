<script setup lang="ts">
import { ref, computed } from 'vue'

import { useHAText } from '../../composables/haText'
import { useHADatabase } from '../../composables/haDb'

import { useColorStore } from '../../stores/colorStore'

import hal from '../../common/halogger'

const { processText } = useHAText()

const colorStore = useColorStore()

const { putMessage, putMedia, getContactByID } = useHADatabase()

const props = defineProps(['uploadFiles', 'replyQuoteIdx', 'alwaysShowSendButton'])

const contactList = ref()

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

const showSendButton = ref(false)

const chatBoxHeight = ref(0)

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

const contactNameList = computed(() => {
    let result = []
    for(const contact of contactList.value){
        result.push(contact.userName)
    }
    return result
})

fetchContactList()

function fetchContactList() {
    getContactByID([2,3,4,5])
    .then(res => {
        hal.log('InputBox/fetchContactList/load contactList ', res)
        contactList.value = res
    })
}

// deal with different keydown: enter, enter+shift, cmd+a, space, delete
function analyzeKeyDown(event: any) {
    // delete
    if (event.keyCode == 8) {
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
            if (currentNode.value) {
                const node = currentNode.value as HTMLElement
                if (node &&
                    node.parentElement?.nodeName == 'SPAN' &&
                    node.textContent?.includes('@')) {
                    if (nodeOffset.value == node.textContent.length) {
                        node.parentElement?.remove()
                        disableUpdate.value = true
                        event.preventDefault(event)
                    }
                }
            }
        }
    }
    // enter
    else if (event.keyCode == 13) {
        // shift + enter, new line
        if (event.shiftKey) {
            // if input box is empty, not allow to enter new line
            if (inputArea.value?.innerText.trim().length == 0) {
                event.preventDefault(event)
            }
        }
        // enter, send message
        else {
            sendMessage()
            event.preventDefault(event)
        }
    }
    // cmd + A, select all
    else if ((event.metaKey || event.ctrlKey) && event.keyCode == 65) {
        disableUpdate.value = true
    }
    // space
    else if (event.keyCode == 32) {
        // if input box is empty, not allow to enter space
        if (inputArea.value?.innerText.trim().length == 0) {
            event.preventDefault(event)
        }
    }
    // cmd + ` : ~
    else if (event.shiftKey && event.keyCode == 192) {
        inputMarkDownSign.value = '~'
    }
    // cmd + - : _
    else if (event.shiftKey && event.keyCode == 189) {
        inputMarkDownSign.value = '_'
    }
    // cmd + 8 : *
    else if (event.shiftKey && event.keyCode == 56) {
        inputMarkDownSign.value = '*'
    }
}

// send the text in input box
async function sendMessage() {
    if (inputArea.value?.innerText.trim().length !== 0 || props.uploadFiles != '') {  
        const message: any = {
            fromUserID: 'j_1H1YKQy74sDoCylPCEA',
            toUserID: 'X9l9StZ_IjuqFqGvBqa27',
            text: processText(inputArea.value?.innerText.trim(), contactNameList.value).html,
            timestamp: (Date.now() / 1000 | 0).toString(),
        }
        if (props.replyQuoteIdx.value > -1) {
            message['quoteId'] = props.replyQuoteIdx.value
        }
        if (props.uploadFiles) {
            const mediaIDArr: number[] = []
            for(const media of props.uploadFiles) {
                const file = await new Blob([media.file]).arrayBuffer()
                const newMedia: any = {
                    'type': media.type,
                    'file': file,
                    'width': media.width,
                    'height': media.height
                }
                if (media.type == 'video') {
                    const preview = await new Blob([media.preview]).arrayBuffer()
                    newMedia['preview'] = preview
                }
                const id = await putMedia(newMedia)
                mediaIDArr.push(id)
            }
            message['mediaID'] = mediaIDArr
        }
        await putMessage(message)

        props.replyQuoteIdx.value = -1
        // hide send button
        showSendButton.value = false
        // clean text inside input box
        if (inputArea.value) {
            inputArea.value.innerText = ''
        }
    }
}

// for mouse movement
function analyzeMouseMovement() {
    // get cursor position
    getCursorPosition()

    // check if mention any contact
    checkContacts()
}

// check if the new input require update content or not
function needUpdate(inputChar: string) {
    let result = false
    // get the old and new input's HTML
    let newInputMessage = processText(inputArea.value?.innerText, contactNameList.value, false, 100, true).html
    let oldInputMessage = processText(inputMessage.value, contactNameList.value, false, 100, true).html

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
function analyzeKeyUp(event: any) {
    // get cursor position
    getCursorPosition()

    // check if mentioned any contact
    checkContacts()

    // if inputArea is empty, delete the remaining <span> and <div>
    if (inputArea.value && inputArea.value?.innerText.trim().length == 0) {
        // clean html inside
        inputArea.value.innerHTML = ''
        // hide send button
        showSendButton.value = false
        return
    }
    else {
        // have valid input show send button
        showSendButton.value = true
    }

    if (event.keyCode != 16 && // Shift
        event.keyCode != 91 && // left cmd on mac
        event.keyCode != 93 && // right cmd on mac
        event.keyCode != 37 && // ArrowLeft
        event.keyCode != 38 && // ArrowUp
        event.keyCode != 39 && // ArrowRight
        event.keyCode != 40) { // ArrowDown 
        if (!disableUpdate.value) {
            let inputChar: string
            // if input ~|*|_ 
            if (inputMarkDownSign.value) {
                inputChar = inputMarkDownSign.value
                inputMarkDownSign.value = ''
            }
            else {
                inputChar = event.key
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
        inputArea.value.innerHTML = processText(inputArea.value?.innerText, contactNameList.value, false, 100, true).html
    }
}

// get cursor position 
function getCursorPosition() {
    let element = inputArea.value
    let sel = window.getSelection()
    let range = sel?.getRangeAt(0)
    let preCursorRange = range?.cloneRange()
    if (range && preCursorRange && element) {
        preCursorRange.selectNodeContents(element)
        preCursorRange.setEnd(range.endContainer, range.endOffset)
        cursorPosition.value = preCursorRange.toString().length
    }
}

// get number of line before cursor
function getCursorLine() {
    // our editable div
    const editable = inputArea.value //document.getElementById('textarea') as Node
    if (editable && editable.childNodes.length == 0) {
        return 1 // input is empty, count as 1 line
    }
    // collapse selection to end
    window.getSelection()?.collapseToEnd()
    const sel = window.getSelection()
    const range = sel?.getRangeAt(0)
    // select to top of editable
    if (editable && editable.firstChild) {
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
    let newHTML = processText(newText, contactNameList.value, false, 100, true).html
    if (inputArea.value) {
        inputArea.value.innerHTML = newHTML
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
            let offsetY = window.innerHeight - chatBox.value.offsetTop
            chatBoxHeight.value = offsetY // update offset of contact list
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
                for (idx = 0; idx < contactNameList.value.length; idx++) {
                    if (chatBox.value && contactNameList.value[idx].includes(contact)) {
                        showContacts.value = true
                        let offsetY = window.innerHeight - chatBox.value.offsetTop
                        chatBoxHeight.value = offsetY // update offset of contact list
                        break
                    }
                }
                contactPosition.value = idx_old + 1
            }
        }

    }

}

function closeContactsAndFocusOnInputBox() {
    // only focus on inputBox after closing contacts
    if (showContacts.value) {
        inputArea.value?.focus()
        // close contact
        showContacts.value = false
    }
}
</script>

<template>
    
    <div class='contactList' v-if='showContacts'>
        <div class='listBox'>
            <div v-for='(value, idx) in contactList' class='container' @mousedown='addContactToInputBox(value.userName)'>
                <div class='avatarContainer'>
                    <div class='avatar'></div>
                </div>
                <div class='content' :class="{ 'contentLastElement': idx == contactNameList.length - 1 }">
                    <div class='contentHeader'>
                        <div class='contentTitle'>
                            {{ value.userName }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class='chatBoxTray' ref='chatBox'>

        <div class='inputBoxContainer'>
            <div class='textarea' ref='inputArea' contenteditable='true' placeholder='Type a message...'
                @focusout='closeContactsAndFocusOnInputBox' @keydown='analyzeKeyDown($event)'
                @keyup='analyzeKeyUp($event)' @click='analyzeMouseMovement()'>
            </div>
        </div>

        <!-- send button -->
        <div class='buttonContainer' v-show='alwaysShowSendButton || showSendButton' @click='sendMessage(); showSendButton = false'>
            <div class='buttonIconContainer'>
                <font-awesome-icon :icon="['fas', 'paper-plane']" size='lg' />
            </div>
        </div>

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
    width: 100%;
    display: flex;
    flex-direction: row;
    bottom: 0;
}

.textarea {
    width: 100%;
    padding: 10px 15px;
    overflow-y: auto;
    resize: none;
    max-height: 110px;
    text-align: left;
    word-break: break-all;

    background: v-bind(inBoundMsgBubbleColor);
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
    border-radius: 15px;

    caret-color: v-bind(cursorColor);
    color: v-bind(textColor);
}

.textarea:focus {
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
    width: inherit;
    height: fit-content;
    max-height: 300px;
    bottom: v-bind(chatBoxHeight + 'px');
    background-color: #f0f2f5;
    border-bottom: 1px solid v-bind(lineColor);

    z-index: 2;
}

.listBox {
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
    flex: 0 0 50px;
    padding: 10px 10px 10px 10px;
}

.avatar {
    width: 30px;
    height: 30px;

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

.buttonContainer {
    height: 40px;
    width: 40px;
    margin: 5px;
    border-radius: 100%;
    background-color: #007AFF;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

    align-content: center;

    display: flex;
    flex-direction: horizontal;

    z-index: 2;
}

.buttonContainer:hover {
    cursor: pointer;
}

.buttonIconContainer {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
}
</style>