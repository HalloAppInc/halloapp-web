<script setup lang="ts">

import { ref, computed } from 'vue'

import Autolinker from 'autolinker'
import GraphemeSplitter from 'grapheme-splitter'

const props = defineProps(['messageList', 'contactList'])

const inputMessage = ref('')

const showContacts = ref(false)
const contactPosition = ref(-1)
const cursorPosition = ref(0)

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

// format input message
function populateTextWithMentions(text: any, mentions: any) {
    let result = ''

    if (mentions) {
        const textArray = [...text]
        let mentionsStartingIndex = 0

        textArray.forEach( (char, idx) => {
            if (char == "@") {
                let isMention = false
                let pushname = ''
                for (let i = mentionsStartingIndex; i < mentions.length; i++) {
                    if (mentions[i].index == idx) {
                        isMention = true
                        pushname = mentions[i].name
                        mentionsStartingIndex++
                        break
                    }
                }

                if (isMention) {
                    result += "[[b]]" + "@" + pushname + "[[/b]]"
                } else {
                    result += char
                }
            } else {
                result += char
            }
        })
    } else {
        result = text
    }
    return result
}

function decorateTextWithMarkdownPlaceholders(text: any) {
    let result = text
        .replace(/((?:^|[^\\])(?:\\.)*)\_(?=[^\s])((\\.|[^_])*)\_/g, '$1[[i]]$2[[/i]]')
        .replace(/((?:^|[^\\])(?:\\.)*)\~(?=[^\s])((\\.|[^~])*)\~/g, '$1[[s]]$2[[/s]]')
        .replace(/((?:^|[^\\])(?:\\.)*)\*(?=[^\s])((\\.|[^*])*)\*/g, '$1[[b]]$2[[/b]]')
    return result
}

function decorateTextWithLinks(text: string) {
    const autolinker = new Autolinker({
        stripPrefix: false,
        urls: {
            schemeMatches: true,
            wwwMatches: true,
            tldMatches: true
        },
        stripTrailingSlash: false,
        replaceFn: function (match) {
            let tag = new Autolinker.HtmlTag({
                tagName: '[[a]]',
                attrs: { 'href': match.getAnchorHref(), 'target': '_blank', 'rel': 'noopener noreferrer' },
                innerHtml: match.getMatchedText()
            })
            return tag
        }
    })

    /* looks for links, phone numbers, and emails */
    let textWithAutoLinkerLinks = autolinker.link(text)

    /* convert <[[a]] to [[a]] since AutoLinker custom tags always have '<' */
    let textWithHALinks = textWithAutoLinkerLinks
        .replaceAll('<[[a]]', '[[a]]')
        .replaceAll('</[[a]]>', '[[/a]]')

    return textWithHALinks
}

function truncateTextIfNeeded(text: string, maxCharacters: number) {
    let charCount = 0
    let isTruncated = false
    let truncatedText = ''

    let splitter = new GraphemeSplitter()
    const graphemes = splitter.splitGraphemes(text)

    let closingTagsQueue = [] // could be holding [[/b]], [[/s]], [[/i]], or [[/a]]

    for (let i = 0; i < graphemes.length; i++) {
        if (charCount >= maxCharacters) { break }

        /* if matcing closing tags are found, pop them off the queue */
        if ((i + 5) < graphemes.length) {
            const subStr = graphemes.slice(i, i + 6).join('')
            const lastClosingTag = closingTagsQueue[closingTagsQueue.length - 1]
            if (subStr == lastClosingTag) {
                closingTagsQueue.pop()
                truncatedText += subStr
                i += 5
                continue
            }
        }

        if ((i + 4) < graphemes.length) {
            const subStr = graphemes.slice(i, i + 5).join('')
            const openingTags = ['[[b]]', '[[s]]', '[[i]]', '[[a]]']

            if (openingTags.includes(subStr)) {
                const closingTag = subStr.slice(0, 2) + '/' + subStr.slice(2)
                closingTagsQueue.push(closingTag)
                truncatedText += subStr
                i += 4

                /* handle anchor tags, expect attributes inside */
                if (subStr == '[[a]]') {
                    let linkIndex = i + 1
                    let anchorAttrStr = ''
                    while (linkIndex < graphemes.length) {
                        const closingAnchorTag = ['>']
                        if ((linkIndex + 1) < graphemes.length) {
                            const subAnchorStr = graphemes.slice(linkIndex, linkIndex + 1).join('')
                            if (closingAnchorTag.includes(subAnchorStr)) {
                                truncatedText += '[[aAttr]]' + anchorAttrStr + '[[/aAttr]]'
                                i = linkIndex
                                break
                            }
                        }
                        anchorAttrStr += graphemes[linkIndex]
                        linkIndex++
                    }
                }
                continue
            }
        }

        truncatedText += graphemes[i]
        charCount++
    }

    if (charCount >= maxCharacters) {
        isTruncated = true
        /* append all leftover closing tags to truncatedText so all tags will be closed */
        for (let i = 0; i < closingTagsQueue.length; i++) {
            truncatedText += closingTagsQueue.pop()
        }
    }

    return { text: truncatedText, isTruncated: isTruncated, countedChars: charCount }
}

function sanitizeHtml(text: string) {
    let element = document.createElement('div')
    element.textContent = text // prefer textContent over innerText, more standardardized and doesn't change newlines to <br>
    return element.innerHTML
}

function populateTextWithHtml(text: string) {
    var result = text
        .replaceAll('\n', '<br>')
        .replaceAll('[[i]]', '<i>')
        .replaceAll('[[/i]]', '</i>')
        .replaceAll('[[s]]', '<s>')
        .replaceAll('[[/s]]', '</s>')
        .replaceAll('[[b]]', '<b>')
        .replaceAll('[[/b]]', '</b>')

        .replaceAll('[[a]]', '<a')
        .replaceAll('[[aAttr]]', '')
        .replaceAll('[[/aAttr]]', '>')
        .replaceAll('[[/a]]', '</a>')
    return result
}

function processText(text: any, mentions: any, truncateText: boolean = false) {
    const textWithMentions = populateTextWithMentions(text, mentions)
    const decoratedTextWithMarkdown = decorateTextWithMarkdownPlaceholders(text)
    let textToBeSanitized = decorateTextWithLinks(decoratedTextWithMarkdown)

    // rough estimate of 330 chars for 12 lines and 110 for 3 lines
    let maxCharsForTextOnlyPosts = 330

    let truncatedText = truncateTextIfNeeded(textToBeSanitized, maxCharsForTextOnlyPosts)
    if (truncatedText.isTruncated) {
        truncatedText.text += '...'
    }

    textToBeSanitized = truncatedText.text

    const santizedHtml = sanitizeHtml(textToBeSanitized)
    const html = populateTextWithHtml(santizedHtml)
    return html
}

function sendMessage() {
    if (inputMessage.value != '') {
        props.messageList.push({
            side: 'right',
            message: processText(inputMessage.value, props.contactList),
            timestamp: '1649204213',
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
        populateTextWithMentions(inputArea.value, props.contactList.value)
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
            contactPosition.value = idx_old+1
        }
    }
}

function addContactToInputBox(contact: string) {
    inputMessage.value = inputMessage.value.substring(0,contactPosition.value) 
                        + contact + inputMessage.value.substring(cursorPosition.value)
    showContacts.value = false
}
</script>

<template>
    <div class='contactList' v-if='showContacts'>
        <div id='listBox'>
            <div v-for='value in contactList' class='container' @click='addContactToInputBox(value)'>
                <div class='avatarContainer'>
                    <div class='avatar'></div>
                </div>
                <div class='content'>
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
        <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'face-smile']" size='2xl' />
        </div>
        <div class='iconContainer'>
            <font-awesome-icon :icon="['fas', 'paperclip']" size='2xl' />
        </div>
        <div class='inputBoxContainer'>
            <textarea id='textarea' cols='85' v-model='inputMessage' class='input'
                placeholder='Type your message here...' 
                @keydown.enter.exact.prevent='sendMessage'
                @keydown.shift.enter.exact.prevent='nextLine' 
                @keyup='analyzeInput($event)'
                @click='analyzeInput($event)' 
                ref='inputArea'>
                </textarea>
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
    resize: none;
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

.contactList {
    background-color: #f0f2f5;
    border-bottom: 1px solid rgb(226, 224, 224);
}

#listBox {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
}

.container {
    display: flex;
    flex-direction: horizontal;
    padding: 0px;
}
.container:hover {
    background-color: rgb(226, 226, 226);
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
    border-bottom: 1px solid rgb(226, 224, 224);

    color: #3b4a54;

    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;

    user-select: none;

    overflow: hidden;
}

.contentHeader {
    display: flex;
    
    justify-content: flex-start;
}

.contentTitle {
    color: #111b21;
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