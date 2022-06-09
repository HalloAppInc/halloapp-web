<script setup lang="ts">

import { ref, computed } from 'vue'

import Autolinker from 'autolinker'
import GraphemeSplitter from 'grapheme-splitter'

const props = defineProps(['messageList'])

const inputMessage = ref('')

const showContacts = ref(false)

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

function processText(text: any, truncateText: boolean = false) {
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
    if (inputArea.value?.innerText != '') {
        props.messageList.push({
            side: 'right',
            message: processText(inputArea.value?.innerText),
            timestamp: '1649204213',
        })
        if (inputArea.value) {
            inputArea.value.innerText = ''
        }


    }
}

function nextLine() {
    inputMessage.value += '\n'
}

function analyzeInput() {
    if (inputArea.value) {
        inputMessage.value = processText(inputArea.value?.innerText)
    }
    console.log('inputmessage=', inputMessage.value)

    // check if mension someone in contacts
    if (inputMessage.value[inputMessage.value.length - 1] == '@') {
        showContacts.value = true
    }
    else {
        showContacts.value = false
    }
    // show markdown 
    if (inputArea.value) {
        console.log('innerText=', inputArea.value.innerText, 'innerHTML=', inputArea.value.innerHTML)
        inputArea.value.innerHTML = inputMessage.value
        // set cursor to the end
        if (inputArea.value.innerText) {
            var range = document.createRange();
            var sel = window.getSelection()
            range.setStart(inputArea.value.childNodes[0], inputArea.value.innerText.length)
            range.collapse(true)
            if (sel) {
                sel.removeAllRanges()
                sel.addRange(range)
            }
        }
    }


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
            <!-- <textarea cols='85' v-model='inputMessage' class='input' placeholder='Type your message here...'
                @keydown.enter.exact.prevent='sendMessage' @keydown.shift.enter.exact.prevent='nextLine'
                ref='inputArea'></textarea> -->
            <div id='textarea' ref='inputArea' contenteditable='true' @keydown.enter.exact.prevent='sendMessage'
                @keyup='analyzeInput'>
            </div>
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

#textarea {
    padding: 10px 15px;
    overflow-y: scroll;
    resize: none;
    width: 800px;
    max-height: 110px;
    text-align: left;

    background: #FFFFFF;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.05);
    border-radius: 15px;
}

#textarea:focus {
    outline: none;
}

.inputBoxContainer {
    padding: 5px 10px 0px 10px;
    display: inline-block;
}
</style>