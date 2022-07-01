<script setup lang="ts">
import { ref, computed } from 'vue'

import { useHAText } from '../../composables/haText'

import { useColorStore } from '../../stores/colorStore'

const colorStore = useColorStore()

const { processText } = useHAText()

const props = defineProps(['messageList', 'contactList'])

const inputMessage = ref('')

const inputMarkDownSign = ref('')

const cursorPosition = ref(0)

const showContacts = ref(false)

const disableUpdate = ref(false)

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


// deal with different keydown: enter, enter+shift, cmd+a, space, delete
function analyzeKeyDown(e: any) {
    // delete
    if (e.keyCode == 8) {
        // if inputbox is empty, clean all element inside
        if (inputArea.value?.innerText == '') {
            inputArea.value?.innerHTML == ''
            return
        }
        // if delete mention <span>@contact</span>
        else {
            totalOffset = cursorPosition.value
            getChildNodeAndOffsetFromNestedNodes(inputArea.value!)
            if (currentNode.value &&
                currentNode.value!.parentElement!.nodeName == 'SPAN' &&
                currentNode.value!.textContent!.includes('@')) {
                if (nodeOffset.value == currentNode.value!.textContent!.length) {
                    currentNode.value!.parentElement?.remove()
                    disableUpdate.value = true
                    e.preventDefault(e)
                }
            }
        }
    }
    // enter
    else if (e.keyCode == 13) {
        // shift + enter, new line
        if (e.shiftKey) {
            // if input box is empty, not allow to enter new line
            if (inputArea.value!.innerText.trim().length == 0) {
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
        if (inputArea.value!.innerText.trim().length == 0) {
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
        inputArea.value!.innerText = ''
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
    let newInputMessage = processText(inputArea.value?.innerText, props.contactList, false, 100, true).html
    let oldInputMessage = processText(inputMessage.value, props.contactList, false, 100, true).html

    let numOfPairOldBTag = oldInputMessage.split('<b>').length - 1
    let numOfPairNewBTag = newInputMessage.split('<b>').length - 1
    let numOfPairOldITag = oldInputMessage.split('<i>').length - 1
    let numOfPairNewITag = newInputMessage.split('<i>').length - 1
    let numOfPairOldSTag = oldInputMessage.split('<s>').length - 1
    let numOfPairNewSTag = newInputMessage.split('<s>').length - 1
    let numOfMentionOld = oldInputMessage.split('<span style="color:#6495ED">@').length - 1
    let numOfMentionNew = newInputMessage.split('<span style="color:#6495ED">@').length - 1

    currentNode.value = null
    totalOffset = cursorPosition.value
    getChildNodeAndOffsetFromNestedNodes(inputArea.value!, false)

    // number of pari of ~|*|_ or mention changed, or maybe select area with ~|*|_ is replaced by ~|*|_ 
    if (numOfPairOldBTag != numOfPairNewBTag || (inputChar == '*' && numOfPairOldBTag == numOfPairNewBTag && numOfPairOldBTag > 0) ||
        numOfPairOldITag != numOfPairNewITag || (inputChar == '_' && numOfPairOldITag == numOfPairNewITag && numOfPairOldITag > 0) ||
        numOfPairOldSTag != numOfPairNewSTag || (inputChar == '~' && numOfPairOldSTag == numOfPairNewSTag && numOfPairOldSTag > 0) ||
        numOfMentionOld != numOfMentionNew) {
        result = true
    }
    // change if input next to ~|*|_|mention or inside mention
    else if (currentNode.value) {
        // if it is in wrong font color (the markdown sign's or mention's color)
        const node = currentNode.value as HTMLElement
        if (node.parentElement) {
            if (node.parentElement!.nodeName == 'SPAN') {
                // update ~|*|_|mention's span
                result = true
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
    if (inputArea.value!.innerText.trim().length == 0) {
        inputArea.value!.innerHTML = ''
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
        inputMessage.value = inputArea.value!.innerText
    }
}

function updateCursorPosition(forAddMention: boolean = false) {
    let range = document.createRange()
    let sel = window.getSelection()!
    totalOffset = cursorPosition.value
    currentNode.value = null
    nodeOffset.value = -1
    getChildNodeAndOffsetFromNestedNodes(inputArea.value!)
    let node = currentNode.value!
    let offset = nodeOffset.value
    // if cursor is at front
    if (!node) {
        node = inputArea.value?.childNodes[0] as Node
        offset = 0
    }
    // if this is used for adding mention, move cursor one space after mention
    if (forAddMention) {
        node = currentNode.value!.parentNode!.nextSibling! // get next node
        offset = 1
    }
    range.setStart(node, offset)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
}

function updateInputContent() {
    inputArea.value!.innerHTML = processText(inputArea.value?.innerText, props.contactList, false, 100, true).html
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

// add contact after @
function addContactToInputBox(contact: string) {
    getCursorPosition()
    let numOfLine = getCursorLine()
    let newText = inputArea.value!.innerText.substring(0, contactPosition.value + (numOfLine - 1))
        + contact + ' ' + inputArea.value!.innerText.substring(cursorPosition.value + (numOfLine - 1))
    let newHTML = processText(newText, props.contactList, false, 100, true).html
    inputArea.value!.innerHTML = newHTML
    showContacts.value = false
    inputArea.value!.focus()
    // update cursor position
    updateCursorPosition(true)
    // check if needs update
    getCursorPosition()
    needUpdate('click')
    inputMessage.value! = inputArea.value!.innerText
}

// check if input after @ is in contact
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
    background: transparent;
    /* color of the tracking area */
}

#textarea::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);
    /* color of the scroll thumb */
    border-radius: 5px;
    border: 0px solid transparent;
    /* creates padding around scroll thumb */
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