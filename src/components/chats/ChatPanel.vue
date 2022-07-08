<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'

import { useI18n } from 'vue-i18n'

import { useTimeformatter } from '../../composables/timeformatter'
import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

import Popup from './Popup.vue'
import Quote from './Quote.vue'

const colorStore = useColorStore()
const mainStore = useMainStore()

const { formatDateForChat, formatTimeForChat } = useTimeformatter()

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const props = defineProps(['messageList'])

const emits = defineEmits(["deleteMessage"])

const menu = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)

const floatMenuPositionX = ref(0)
const floatMenuPositionY = ref(0)

const chatPanelHeight = ref(0)

let handleScrollTimer: any

const showJumpDownButton = ref(false)
const showMenu = ref(false)
const showReply = ref(false)

const selectMessageId = ref(-1)

// set floating time stamp's content
const currentMsgTimestamp = ref()

const messageNumber = computed(() => {
    return props.messageList.length
})

// pre-process messageList
const data = computed(() => {
    let result = JSON.parse(JSON.stringify(props.messageList))
    for (var i = 0; i < result.length; i++) {
        if (result[i].type != 'timestamp') {
            let time = formatTimeForChat(parseInt(result[i].timestamp), <string>locale.value)
            let res = appendSpaceForMsgInfo(props.messageList[i].message, time, result[i].type == 'outBound')
            result[i].message = res[0]
            result[i].font = res[1]
            result[i].timestamp = time
        }
        else {
            result[i].timestamp = formatDateForChat(parseInt(result[i].timestamp), <string>locale.value)
        }
    }

    return result
})

const quoteMessage = ref({})

const headerColor = computed(() => {
    return colorStore.header
})
const textColor = computed(() => {
    return colorStore.text
})
const outBoundMsgBubble = computed(() => {
    return colorStore.outBoundMsgBubble
})
const inBoundMsgBubble = computed(() => {
    return colorStore.inBoundMsgBubble
})
const timeBubble = computed(() => {
    return colorStore.timeBubble
})
const timestamp = computed(() => {
    return colorStore.timestamp
})
const hoverColor = computed(() => {
    return colorStore.hover
})
const lineColor = computed(() => {
    return colorStore.line
})
const backgroundColor = computed(() => {
    return colorStore.background
})

nextTick(() => {
    handleScroll()
    gotoBottom('auto')
    new ResizeObserver(setChatPanelHeight).observe(content.value!)
})

// add extra space after text to fit time stamp and checkmarks
function appendSpaceForMsgInfo(msg: string, time: string, isOutBound: boolean) {
    let width = 0
    let result = ''
    if (isOutBound) {
        width = time.length * 2.5 + 15
    }
    else {
        width = time.length * 2.5 + 5
    }
    let newDiv = "<span style='padding: 0px " + width + "px;display: inline-block;'></span>" // padding:0px "+ width +"px;
    result = msg.concat(newDiv)

    var patterns = [
        '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
        '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
        '\ud83d[\ude80-\udeff]', // U+1F680 to U+1F6FF
    ]

    let pureText = (msg.replaceAll(new RegExp(patterns.join('|'), 'g'), '') == '')
    let numOfEmoji = msg.split(new RegExp(patterns.join('|'))).length - 1
    let font = (numOfEmoji > 0 && numOfEmoji <= 3 && pureText)
    return [result, font]
}

// listen to msg list, when a new msg comes in, scroll to the bottom
watch(messageNumber, (newVal, oldVal) => {
    if (newVal > oldVal) {
        showReply.value = false
        mainStore.gotoChatPage('')
        nextTick(() => {
            gotoBottom('smooth')
            handleScroll()
        })
    }
})

watch(chatPanelHeight, () => {
    nextTick(() => {
        gotoBottom('auto')
    })
})

function setChatPanelHeight() {
    chatPanelHeight.value = content.value ? content.value.clientHeight : 0
    // console.log(chatPanelHeight.value)
}

function handleScroll() {
    clearTimeout(handleScrollTimer)
    handleScrollTimer = setTimeout(debouncedHandleScroll, 15) // 15 seems the best but can be tinkered with
}

// when scroll the scroll bar get the scroll bar's current height
// get the value of timestamp of the msg bubble at current floating timestamp's height
function debouncedHandleScroll() {
    if (!content.value) { return }

    let contentViewportOffset = content.value.getBoundingClientRect() // offset is relative to viewport

    /* hide static timestamp bubbles when they're above the floating timestamp */
    let staticTimestampList = content.value?.getElementsByClassName('staticTimestamp')
    if (staticTimestampList) {

        for (let i = staticTimestampList.length - 1; i >= 0; i--) { // start from most recent msg
            let staticTimestamp = staticTimestampList[i] as HTMLElement

            if (staticTimestamp.offsetHeight > 0) {

                let staticTimestampViewportOffset = staticTimestamp.getBoundingClientRect()

                const topAreaRelativeToContent = contentViewportOffset.top + 10

                if (staticTimestampViewportOffset.top <= topAreaRelativeToContent) {
                    staticTimestamp.style.visibility = 'hidden'
                    // break to save a little bit of cycle since each run should hide at max one timestamp
                    break
                } else {
                    staticTimestamp.style.visibility = 'visible'
                }
            }
        }
    }

    /* change floating timestamp */
    if (props.messageList.length != 0) {

        let closestElement = document.elementFromPoint(contentViewportOffset.left, contentViewportOffset.top)

        // only change when overlap with a static timestamp
        let timestampEl = closestElement?.getElementsByClassName('timestampBig')[0] as HTMLDivElement

        if (timestampEl) {
            currentMsgTimestamp.value = timestampEl.textContent
        }
    }
    else {
        currentMsgTimestamp.value = "No Messages"
    }

    /* toggle jump button visiblity */
    if (content.value &&
        content.value.scrollTop + content.value.clientHeight < content.value.scrollHeight - 50) {
        showJumpDownButton.value = true
    }
    else {
        showJumpDownButton.value = false
    }
}

// jump to bottom
function gotoBottom(type: ScrollBehavior | undefined) {
    // behavior can be instant(auto)/smooth
    content.value?.scrollTo({ left: 0, top: content.value?.scrollHeight, behavior: type })
}

function gotoProfile(e: any) {
    let contactName = e.target.innerText.substring(1)
    // go to user's profile page
}

function openMenu(e: any, forInBound: boolean, idx: number) {
    showMenu.value = !showMenu.value
    // if close menu
    if (!showMenu.value) {
        return
    }
    selectMessageId.value = idx

    let bounds = e.target.getBoundingClientRect()
    for (let key in bounds) {
        if (key == 'right') {
            floatMenuPositionX.value = window.outerWidth - bounds[key]
            // if its for inbound msg, make it align right; for outbound msg align left
            if (forInBound) {
                nextTick(() => {
                    if (menu.value) {
                        floatMenuPositionX.value -= menu.value.clientWidth
                    }
                })
            }
        }
        else if (key == 'top') {
            // clientHeight + scrollTop = scrollHeight
            if (content.value) {
                floatMenuPositionY.value = -1 * (content.value?.scrollHeight - bounds[key] - content.value?.scrollTop) + 20
                let bottomOffset = content.value?.clientHeight - bounds[key]
                // visual offset, not let part of menu hidden under input box
                if (bottomOffset <= 80) {
                    let msgBubble
                    // get msg bubble's height
                    if (e.target.nodeName == 'svg') {
                        msgBubble = e.target.parentElement.parentElement.parentElement
                        floatMenuPositionY.value -= msgBubble.clientHeight
                    }
                    else if (e.target.nodeName == 'path') {
                        msgBubble = e.target.parentElement.parentElement.parentElement.parentElement
                        floatMenuPositionY.value -= msgBubble.clientHeight
                    }
                    else if (e.target.nodeName == 'DIV' && e.target.className == 'togglerIconContainer') {
                        msgBubble = e.target.parentElement.parentElement
                        floatMenuPositionY.value -= msgBubble.clientHeight
                    }
                    floatMenuPositionY.value -= 50
                }
            }
        }
    }
}


// add listener on floating menu
function closeMenu() {
    showMenu.value = false
}

onMounted(() => {
    document.addEventListener("click", closeMenu)
})

onUnmounted(() => {
    document.removeEventListener("click", closeMenu)
})

function openReply() {
    mainStore.gotoChatPage('reply' + selectMessageId.value)
    showReply.value = true
    showMenu.value = false
    // get quote message
    quoteMessage.value = getQuoteMessageData(props.messageList[selectMessageId.value])
}

function getQuoteMessageData(message: any) {
    let data = JSON.parse(JSON.stringify(message))
    if (message['type'] == 'outBound') {
        data['sender'] = 'YOU'
    }
    else if (message['type'] == 'inBound') {
        data['sender'] = 'User1' // should replace by real data
    }
    return data
}
</script>

<template>
    <div id='contents' ref='content' @scroll='handleScroll()'>
        <!-- chat msg -->
        <div class='containerChat' v-for='(value, idx) in data'>
            <!-- inbound msg -->
            <div v-if="value.type == 'inBound'" class='contentTextBody contentTextBodyInBound'
                :class="idx == 0 || (idx != 0 && data[idx - 1].type != 'inBound') ? 'chatBubbleBigMargin' : 'chatBubbleSmallMargin'">
                <div class='chatBubble chatBubbleInBound'>
                    <div class='menuToggler menuTogglerInBound'>
                        <div class='togglerIconContainer' @click.stop='openMenu($event, true, idx)'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>
                    <!-- quote -->
                    <div class='chatReplyContainer' v-if='value.quoteIdx > -1'>
                        <Quote :quote-message='getQuoteMessageData(messageList[value.quoteIdx])' />
                    </div>
                    <div class='chatTextContainer' :class='{ bigChatTextContainer: value.font }'>
                        <!-- show message content -->
                        <span v-html='value.message' :class="value.font ? 'onlyEmoji' : 'noOverflow'">
                        </span>
                    </div>
                    <div class='msgInfoContainer'>
                        <div class='msgInfoContent'>
                            <div class='timestamp'>
                                {{ value.timestamp }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- outBound msg -->
            <div v-else-if="value.type == 'outBound'" class='contentTextBody contentTextBodyOutBound'
                :class="idx == 0 || (idx != 0 && data[idx - 1].type != 'outBound') ? 'chatBubbleBigMargin' : 'chatBubbleSmallMargin'">
                <div class='chatBubble chatBubbleoutBound'>
                    <div class='menuToggler menuTogglerOutBound'>
                        <div class='togglerIconContainer' @click.stop='openMenu($event, false, idx)'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>
                    <!-- quote -->
                    <div class='chatReplyContainer' v-if='value.quoteIdx > -1'>
                        <Quote :quote-message='getQuoteMessageData(messageList[value.quoteIdx])' />
                    </div>
                    <div class='chatTextContainer' :class='{ bigChatTextContainer: value.font }'>
                        <!-- show message content -->
                        <span v-html='value.message' :class="value.font ? 'onlyEmoji' : 'noOverflow'"
                            @click="gotoProfile($event)">
                        </span>
                    </div>
                    <div class='msgInfoContainer'>
                        <div class='msgInfoContent'>
                            <div class='timestamp'>
                                {{ value.timestamp }}
                            </div>
                            <div class='iconContainer'>
                                <font-awesome-icon :icon="['fas', 'check-double']" size='xs' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- timestamp -->
            <div v-else-if="value.type == 'timestamp'" class='staticTimestamp contentTextBody contentTextBodyTime'>
                <div class='chatBubble chatBubbleTime'>
                    <div class='timestampContainerBig'>
                        <div class='timestampBig'>
                            {{ value.timestamp }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- floating timestamp -->
        <div class='containerFloatingTimestamp'>
            <div class='contentTextBody contentTextBodyTime'>
                <div class='chatBubble chatBubbleTime'>
                    <div class='timestampContainerBig'>
                        <div class='timestampBig'>
                            {{ currentMsgTimestamp }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- jump down button -->
        <transition name='button'>
            <div class='buttonContainer' v-show='showJumpDownButton' @click="gotoBottom('smooth')">
                <div class='buttonIconContainer'>
                    <font-awesome-icon :icon="['fas', 'angle-down']" size='lg' />
                </div>
            </div>
        </transition>


        <!-- floating menu -->
        <div class='chatSettingsContanier' v-if='showMenu' @click.stop>
            <div class='menu' ref='menu'>
                <div class='menuContainer' @mousedown='mainStore.gotoChatPage("delete")'>
                    <div class='textContainer'>
                        <div class='contentTextBody contentTextBodyForSettings'>
                            {{ t('chatMsgBubbleSettings.deleteMessage') }}
                        </div>
                    </div>
                </div>
                <div class='menuContainer' @mousedown='openReply'>
                    <div class='textContainer textContainerlastElement'>
                        <div class='contentTextBody contentTextBodyForSettings'>
                            {{ t('chatMsgBubbleSettings.reply') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- popup -->
    <Popup @confirm-Ok="$emit('deleteMessage', selectMessageId)" />

    <!-- Reply -->
    <div class='containerReply' v-if='showReply'>
        <div class='containerReplyWithRightMargin'>
            <Quote :quote-message='quoteMessage' />
        </div>
        <div class='closeIconContainer'>
            <div class='iconContainer closeIcon' @click="showReply = false; mainStore.gotoChatPage('')">
                <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
            </div>
        </div>
    </div>

</template>

<style scoped>
/* animation for button */
.button-enter-active,
.button-leave-active {
    transition: all 0.5s ease
}

.button-enter-from,
.button-leave-to {
    transform: scale(0.1);
    opacity: 0;
}

*::-webkit-scrollbar {
    width: 10px;
}

*::-webkit-scrollbar-track {
    background: white;
}

*::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);

    border: 0px solid white;
}

#contents {
    width: 100%;
    height: 100%;

    overflow-y: scroll;
    overflow-x: hidden;
    padding-bottom: 50px;

    display: flex;
    flex-direction: column;
}

.containerChat {
    display: flex;
    flex-direction: column;
    padding: 0px;
    margin: 0px;
}

.chatReplyContainer {
    margin-bottom: 5px;
}

.contentTextBody {
    width: 100%;

    display: flex;
    flex-direction: row;
}

.contentTextBodyInBound {
    align-self: flex-start;

    justify-content: flex-start;
}

.contentTextBodyOutBound {
    align-self: flex-end;

    justify-content: flex-end;
}

.contentTextBodyTime {
    align-self: center;

    justify-content: center;
}

.chatBubble {
    padding: 10px 15px;
    border-radius: 14px;
    position: relative;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    border: 0.5px solid rgba(0, 0, 0, 0.1);
}

.chatBubble:hover .menuToggler {
    display: flex;
}

.chatBubbleInBound {
    left: 10px;
    max-width: 75%;
    min-width: 2%;
    background: v-bind(inBoundMsgBubble);
    overflow-x: hidden;
}

.chatBubbleoutBound {
    right: 10px;
    max-width: 75%;
    background: v-bind(outBoundMsgBubble);
    overflow-x: hidden;
}

.chatBubbleTime {
    background: v-bind(timeBubble);
    border: 0.5px solid rgba(101, 61, 61, 0.2);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    width: fit-content;
    margin: 10px 0px 0px 0px;
}

.chatBubbleSmallMargin {
    padding: 1px 0px 0px 0px;
}

.chatBubbleBigMargin {
    padding: 10px 0px 0px 0px;
}

.chatTextContainer {
    color: v-bind(textColor);
    font-weight: 500;
    font-size: 15px;
    line-height: 120%;

    align-items: center;
    letter-spacing: 0.02em;
    margin: 5px 0px;
}

.bigChatTextContainer {
    margin-top: 10px;
}

.noOverflow {
    width: calc(100% - 1em);
    overflow-wrap: anywhere;
    white-space: normal;
}

.onlyEmoji {
    font-size: xx-large;
}

.msgInfoContainer {
    height: fit-content;
    width: fit-content;

    position: absolute;
    bottom: 0;
    right: 0;

    margin: 0px 15px 10px 10px;
    align-self: flex-end;
}

.msgInfoContent {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.timestamp {
    font-size: 10px;
    color: v-bind(timestamp);
}

.iconContainer {
    padding: 0px 5px;
    color: #1E90FF;
}

.timestampContainerBig {
    width: fit-content;
    flex-direction: column;
}

.timestampBig {
    white-space: nowrap;
    width: fit-content;
    font-size: small;
    color: v-bind(timestamp);
}

.containerFloatingTimestamp {
    position: absolute;
    align-self: center;
    z-index: 3;
}

.buttonContainer {
    position: fixed;
    right: 20px;
    bottom: 150px;

    height: 40px;
    width: 40px;
    display: flex;
    flex-direction: horizontal;
    border-radius: 100%;
    background-color: white;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

    align-content: center;

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
}

.menuToggler {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    z-index: 1;
    /* set to top layer */

    display: none;
    justify-content: center;
    align-items: center;
}

.menuTogglerInBound {
    background: v-bind(inBoundMsgBubble);
    box-shadow: 0px 0px 20px 20px v-bind(inBoundMsgBubble);
}

.menuTogglerOutBound {
    background: v-bind(outBoundMsgBubble);
    box-shadow: 0px 0px 20px 20px v-bind(outBoundMsgBubble);
}

.togglerIconContainer {
    color: #1E90FF;
}

.togglerIconContainer:hover {
    cursor: pointer;
}

.noOverflow :deep(.mention) {
    color: #6495ED;
    text-decoration: none;
}

.noOverflow :deep(.mention):hover {
    cursor: pointer;
    color: #6495ED;
    text-decoration: none;
}


.chatSettingsContanier {
    position: relative;
    top: v-bind(floatMenuPositionY + 'px');
    right: v-bind(floatMenuPositionX + 'px');

    z-index: 2;
}

.menu {
    position: absolute;
    width: 200px;
    padding: 0px;
    right: 10px;
    background-color: v-bind(backgroundColor);
    border-radius: 5px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
}


.menuContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.menuContainer:hover {
    background-color: v-bind(hoverColor);
    cursor: pointer;
}


.textContainer {
    color: v-bind(textColor);
    width: 100%;
    height: 2em;
    padding: 20px;
    border-bottom: 1px solid v-bind(lineColor);

    display: flex;
    align-items: center;
}

.textContainerlastElement {
    border-bottom: 0px;
}


.contentTextBodyForSettings {
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.containerReply {
    position: absolute;
    bottom: 50px;
    height: fit-content;
    width: 100%;
    background-color: v-bind(headerColor);

    display: flex;
    flex-direction: row;
    justify-content: center;

    z-index: 1;
}

.containerReplyWithRightMargin {
    width: 80%;
    margin: 5px 0px;
}


.closeIconContainer {
    position: absolute;
    bottom: 30px;
    right: 20px;

    width: 50px;
    border-radius: 100%;
}

.closeIcon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.closeIcon:hover {
    cursor: pointer;
}
</style>