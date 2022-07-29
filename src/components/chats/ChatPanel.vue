<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'

import { useI18n } from 'vue-i18n'
import GraphemeSplitter from 'grapheme-splitter'

import hal from '../../common/halogger'

import { useTimeformatter } from '../../composables/timeformatter'
import { useHAMediaResize } from '../../composables/haMediaResize'
import { useHADatabase } from '../../composables/haDb'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

import Popup from './Popup.vue'
import Quote from './Quote.vue'
import FullScreener from './FullScreener.vue'
import MediaCollage from './MediaCollage.vue'
import Notification from './Notification.vue'
import { number } from '@intlify/core-base'

const colorStore = useColorStore()
const mainStore = useMainStore()

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const { formatTimeDateOnlyChat, formatTimeChat, formatTimeFullChat, timeDiffBiggerThanOneDay } = useTimeformatter()
const { setMediaSizeInMediaList } = useHAMediaResize()
const { getMessageByID, deleteMessageByID, 
        cleanMessageContentByID, loadMessageList, 
        notifyWhenChanged, initMessageListAndMediaList,
        getMedia } = useHADatabase()

// TODO: delete this, only for testing!
initMessageListAndMediaList().then(() => {
    loadMessageListIntoChatPanel()  
})

const messageListFromDB = ref()

const props = defineProps(['replyQuoteIdx'])

const menu = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)

const floatMenuPositionX = ref(0)
const floatMenuPositionY = ref(0)

const chatPanelHeight = ref(0)

let handleScrollTimer: any

const showJumpDownButton = ref(false)
const showMenu = ref(false)
const showReply = ref(false)
const showFullScreener = ref({ 'value': false })
const showPopup = ref({ 'value': false, 'type': 'delete', 'messageType': 'normal' })
const isForDeletedMessage = ref(false)

const selectMessageIdx = ref(-1)
const selectMediaList = ref()
const selectMediaIdx = ref()
const menuTimestamp = ref('')
const quoteMessage = ref({})
const NotificationQueue = ref(<string[]>[])

// set floating time stamp's content
const currentMsgTimestamp = ref()

const data = ref()

const messageNumber = computed(() => {
    if (data.value) {
        return data.value.length
    }
    else {
        return 0
    }
})

// listen to chatID, if choose another chat in chatlist, update chatPanel
const chatID = computed(() => {
    return mainStore.chatID
})

watch(chatID, () => {
    loadMessageListIntoChatPanel()
})

// listen to msg list, when a new msg comes in, scroll to the bottom
watch(messageNumber, (newVal, oldVal) => {
    if (newVal > oldVal) {
        showReply.value = false
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

watch(messageListFromDB, () => {
    parseMessage()
})

notifyWhenChanged(listenerFunction)

const headerColor = computed(() => {
    return colorStore.header
})
const textColor = computed(() => {
    return colorStore.text
})
const outBoundMsgBubbleColor = computed(() => {
    return colorStore.outBoundMsgBubble
})
const inBoundMsgBubbleColor = computed(() => {
    return colorStore.inBoundMsgBubble
})
const timeBubbleColor = computed(() => {
    return colorStore.timeBubble
})
const timestampColor = computed(() => {
    return colorStore.timestamp
})
const iconColor = computed(() => {
    return colorStore.icon
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

async function parseMessage() {
    if (!messageListFromDB.value) {
        data.value = []
        return
    }

    let result = []
    let numOfTimestamp = 0
    for(let i = 0; i < messageListFromDB.value.length; i++) {
        const message = messageListFromDB.value[i]
        // add timestamp
        if (i == 0) {
            if (message.timestamp) {
                result.push({
                    'type': 'timestamp',
                    'timestamp': formatTimeDateOnlyChat(parseInt(message.timestamp), <string>locale.value),
                })
                numOfTimestamp++
            }
        }
        else {
            const timestampStringOld = messageListFromDB.value[i-1].timestamp
            const timestampStringNew = message.timestamp
            if (timestampStringOld && timestampStringNew 
                && timeDiffBiggerThanOneDay(parseInt(timestampStringOld), parseInt(timestampStringNew))) {
                result.push({
                    'type': 'timestamp',
                    'unixTimestamp': timestampStringNew,
                    'timestamp': formatTimeDateOnlyChat(parseInt(timestampStringNew), <string>locale.value),
                })
                numOfTimestamp++
            }
        }

        let time = formatTimeChat(parseInt(message.timestamp), <string>locale.value)
        let type = (message.fromUserID == mainStore.loginUserID) ? 'outBound' : 'inBound'
        console.log('message from id=', message.fromUserID, 'me=', mainStore.loginUserID)
        // not delete
        if ( message.text != undefined) {
            let resMsg = appendSpaceForMsgInfo(message.text, time, type == 'outBound')
            let newMediaList
            if (message.mediaID) {
                const mediaArray = await getMedia(message.mediaID)
                newMediaList = []
                for(const media of mediaArray) {
                    // create url for file and preview
                    const file = new Blob([media.file]) 
                    const newMedia: any = {
                        'type': media.type,
                        'width': media.width,
                        'height': media.height,
                        'url': URL.createObjectURL(file),
                    }
                    if(!media.preview) {
                        newMedia['previewUrl'] = newMedia.url
                    }
                    else {
                        const preview = new Blob([media.preview])
                        newMedia['previewUrl'] = URL.createObjectURL(preview)
                    }
                    newMediaList.push(newMedia)
                }
                setMediaSizeInMediaList(newMediaList)
            }
            let quoteMessage
            if (message.quoteId) {
                quoteMessage = await getQuoteMessageData(message.quoteId)
            }
            result.push({
                'id': message.id,
                'type': type,
                'timestamp': time,
                'text': resMsg[0],
                'font': resMsg[1],
                'unixTimestamp': message.timestamp,
                'display': true,
                'media': newMediaList,
                'quoteMessage': quoteMessage,
                'quoteIdx': message.quoteId
            })
        }
        else {
            result.push({
                'id': message.id,
                'type': type,
                'unixTimestamp': message.timestamp,
                'timestamp': '',
                'text': 'You deleted this message.',
                'font': 'deletedMessage',
                'display': true,
            })
        }       
    }
    data.value = result
}

async function listenerFunction(type: string) {
    hal.log('ChatPanel/notifyWhenChanged/' + type)
    loadMessageListIntoChatPanel()
}

let load: any
function loadMessageListIntoChatPanel() {
    /* loadMessageList('mainStore.chatID')
    .then(res => {
        messageListFromDB.value = res
    }) */
    /* 
    wait for transaction to finish, add timeout because 
    db.hook may be trigger before it actual ends.
    */
    clearTimeout(load)
    load = setTimeout(() => {
        loadMessageList(mainStore.chatID)
        .then(res => {
            messageListFromDB.value = res
        })
    }, 15)
}

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

    let font = ''
    let lessThanThreeEmoji = false

    let splitter = new GraphemeSplitter()
    const graphemes = splitter.splitGraphemes(msg)

    if (graphemes.length <= 3) {

        lessThanThreeEmoji = true // assume true to begin
  
        const emojiRegx = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/i

        for (let i = 0; i < graphemes.length; i++) {
            if (!emojiRegx.test(graphemes[i])) {
                lessThanThreeEmoji = false
                break
            }
        }
    } 
    
    if (lessThanThreeEmoji) {
        font = 'onlyEmoji'
    }
    else {
        font = 'noOverflow'
    }

    return [result, font]
}

function setChatPanelHeight() {
    chatPanelHeight.value = content.value ? content.value.clientHeight : 0
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
    if (data.value && data.value.length != 0) {

        let closestElement = document.elementFromPoint(contentViewportOffset.left, contentViewportOffset.top)

        // find the timestamp in msg bubble
        let timestampEl = closestElement?.getElementsByClassName('timestamp')[0] as HTMLDivElement
        if (timestampEl) {
            let unixTimestamp = timestampEl.getAttribute('data-msg-timestamp') as string
            currentMsgTimestamp.value = formatTimeDateOnlyChat(parseInt(unixTimestamp), <string>locale.value)
        }
        if (!timestampEl) {
            // find the timestamp in static timestamp bubble
            timestampEl = closestElement?.getElementsByClassName('timestampBig')[0] as HTMLDivElement
            if (timestampEl) {
                currentMsgTimestamp.value = timestampEl.textContent
            }
        }
    }
    else {
        currentMsgTimestamp.value = 'No Messages'
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

function gotoProfile(event: any) {
    let contactName = event.target.innerText.substring(1)
    // go to user's profile page
}

function openMenu(event: any, forInBound: boolean, idx: number, timestamp: string) {
    showMenu.value = !showMenu.value
    // if close menu
    if (!showMenu.value) {
        return
    }

    // if this is a deleted message
    if (!timestamp) {
        isForDeletedMessage.value = true
        selectMessageIdx.value = idx
    }
    else {
        isForDeletedMessage.value = false
        menuTimestamp.value = formatTimeFullChat(parseInt(timestamp), <string>locale.value)
        selectMessageIdx.value = idx
    }

    // set floating menu position
    let bounds = event.target.getBoundingClientRect()
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
                // visual offset, do not let part of menu hidden under input box
                if (bottomOffset <= 80) {
                    let msgBubble
                    // get msg bubble's height
                    if (event.target.nodeName == 'svg') {
                        msgBubble = event.target.parentElement.parentElement.parentElement
                        floatMenuPositionY.value -= msgBubble.clientHeight
                    }
                    else if (event.target.nodeName == 'path') {
                        msgBubble = event.target.parentElement.parentElement.parentElement.parentElement
                        floatMenuPositionY.value -= msgBubble.clientHeight
                    }
                    else if (event.target.nodeName == 'DIV' && event.target.className == 'togglerIconContainer') {
                        msgBubble = event.target.parentElement.parentElement
                        floatMenuPositionY.value -= msgBubble.clientHeight
                    }
                    
                    // move 90px upwards if this message is not deleted
                    if (!isForDeletedMessage.value) {
                        floatMenuPositionY.value -= 90
                    }
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

function deleteMessage(id: number, deleteForEveryone: boolean) {
    // delete for everyone: delete message content in db
    if (deleteForEveryone) {
        hal.log('ChatPanel/deleteMessage/delete for everyone')
        cleanMessageContentByID(id)
    }
    // delete for me: delete whole record in db
    else {
        hal.log('ChatPanel/deleteMessage/delete for me')
        deleteMessageByID(id)
    }
}

function openPopup() {
    if (isForDeletedMessage.value) {
        showPopup.value.messageType = 'deleted'
    }
    else {
        showPopup.value.messageType = 'normal'
    }
    showPopup.value.value = true
}

function openMedia(mediaList: any, idx: number) {
    selectMediaList.value = mediaList
    selectMediaIdx.value = idx
    // go to fullscreener
    showFullScreener.value.value = true
}

async function openReply(id: number) {
    showReply.value = true
    showMenu.value = false
    // get quote message
    props.replyQuoteIdx.value = id
    quoteMessage.value = await getQuoteMessageData(id)
}

async function getQuoteMessageData(id: number) {
    const message = await getMessageByID(id)
    if (!message) {
        const data = {
            'id': number,
            'sender': '',
            'text': 'Message deleted'
        }
        return data
    }
    else {
        const data = JSON.parse(JSON.stringify(message))
        if (message.fromUserID == mainStore.loginUserID) {
            data['sender'] = 'YOU'
        }
        else {
            data['sender'] = 'User1'
        }
        return data
    }
}

function gotoQuoteMessage(quoteIdx: number) {
    getMessageByID(quoteIdx)
    .then((message) => {
        if (!message) {
            hal.log('ChatPanel/gotoQuoteMessage/Quoted message has been deleted')
            // message has been deleted!
            NotificationQueue.value.push(t('chatNotification.messageDeleted'))
        }
        else if (!message.timestamp) {
            hal.log('ChatPanel/gotoQuoteMessage/Quoted message has been deleted')
            // message has been deleted!
            NotificationQueue.value.push(t('chatNotification.messageDeleted'))
        }
        else {
            const targetElement = document.getElementById('messageBubble' + quoteIdx)
            if (targetElement) {
                hal.log('ChatPanel/gotoQuoteMessage/Go to quoted message')
                const offsetTop = targetElement.offsetTop - targetElement.offsetHeight
                content.value?.scrollTo({ left: 0, top: offsetTop, behavior: 'smooth' })
                setTimeout(() => {
                    targetElement.classList.add('chatBubbleAnimation')
                    setTimeout(() => {
                        targetElement.classList.remove('chatBubbleAnimation')
                    }, 5000)
                }, 1000)
            }
        }
    })
}
</script>

<template>

    <div class='contents' ref='content' @scroll='handleScroll()'>
        <slot name="subHeader"></slot>
        <!-- chat msg -->
        <div class='containerChat' v-for='(value, idx) in data'>

            <!-- inbound msg -->
            <div v-if="value.display && value.type == 'inBound'" class='contentTextBody contentTextBodyInBound'
                :class="idx == 0 || (idx != 0 && data[idx - 1].type != 'inBound') ? 'chatBubbleBigMargin' : 'chatBubbleSmallMargin'">
                <div class='chatBubble chatBubbleInBound' :id='"messageBubble" + value.id'>

                    <!-- toggler -->
                    <div class='menuToggler menuTogglerInBound'>
                        <div class='togglerIconContainer' @click.stop='openMenu($event, true, value.id, value.timestamp)'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>

                    <!-- quote -->
                    <div class='chatReplyContainer' v-if='value.quoteIdx'
                        @click='gotoQuoteMessage(value.quoteIdx)'>
                        <Quote :quoteMessage='value.quoteMessage' />
                    </div>

                    <!-- media -->
                    <div class='mediaContainer' v-if='value.media != null'>
                        <MediaCollage @openMedia='openMedia' :media-list='value.media' />
                    </div>

                    <!-- text -->
                    <div class='chatTextContainer' :class='{ bigChatTextContainer: value.font == "onlyEmoji" }'>
                        <!-- show message content -->
                        <span v-html='value.text' :class='value.font'>
                        </span>
                    </div>

                    <!-- timestamp -->
                    <div class='msgInfoContainer' v-if='value.timestamp'>
                        <div class='msgInfoContent'>
                            <div class='timestamp' :data-msg-timestamp='value.unixTimestamp'>
                                {{ value.timestamp }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- outBound msg -->
            <div v-else-if="value.display && value.type == 'outBound'" class='contentTextBody contentTextBodyOutBound'
                :class="idx == 0 || (idx != 0 && data[idx - 1].type != 'outBound') ? 'chatBubbleBigMargin' : 'chatBubbleSmallMargin'">
                <div class='chatBubble chatBubbleoutBound' :id='"messageBubble" + value.id'>

                    <!-- toggler -->
                    <div class='menuToggler menuTogglerOutBound'>
                        <div class='togglerIconContainer' @click.stop='openMenu($event, false, value.id, value.timestamp)'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>

                    <!-- quote -->
                    <div class='chatReplyContainer' v-if='value.quoteIdx'
                        @click='gotoQuoteMessage(value.quoteIdx)'>
                        <Quote :quoteMessage='value.quoteMessage' />
                    </div>

                    <!-- media -->
                    <div class='mediaContainer' v-if='value.media != null'>
                        <MediaCollage @openMedia='openMedia' :media-list='value.media' />
                    </div>

                    <!-- text -->
                    <div class='chatTextContainer' :class='{ bigChatTextContainer: value.font == "onlyEmoji" }'>
                        <!-- show message content -->
                        <span v-html='value.text' :class='value.font' @click="gotoProfile($event)">
                        </span>
                    </div>

                    <!-- timestamp -->
                    <div class='msgInfoContainer' v-if='value.timestamp'>
                        <div class='msgInfoContent'>
                            <div class='timestamp' :data-msg-timestamp='value.unixTimestamp'>
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

                <div class='menuContainer' @mousedown='openPopup'>
                    <div class='textContainer'>
                        <div class='contentTextBody contentTextBodyForSettings'>
                            {{ t('chatMsgBubbleSettings.deleteMessage') }}
                        </div>
                    </div>
                </div>

                <div v-if='!isForDeletedMessage' class='menuContainer' @mousedown='openReply(selectMessageIdx)'>
                    <div class='textContainer'>
                        <div class='contentTextBody contentTextBodyForSettings'>
                            {{ t('chatMsgBubbleSettings.reply') }}
                        </div>
                    </div>
                </div>

                <div v-if='!isForDeletedMessage' class='menuTimestampLong'>
                    <div class='timestampContainerBig'>
                        <div class='timestampBig'>
                            {{ menuTimestamp }}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- popup -->
    <Popup @deleteForEveryone='deleteMessage(selectMessageIdx, true)'
        @deleteForMe='deleteMessage(selectMessageIdx, false)' 
        @confirmOk='deleteMessage(selectMessageIdx, false)'
        :showPopup='showPopup' />

    <!-- Reply -->
    <div class='containerReply' v-if='showReply'>
        <div class='containerReplyWithRightMargin'>
            <Quote :quoteMessage='quoteMessage' />
        </div>
        <div class='closeIconContainer'>
            <div class='iconContainer closeIcon' @click="showReply = false">
                <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
            </div>
        </div>
    </div>

    <!-- show media in full screen -->
    <FullScreener :showFullScreener='showFullScreener' 
        :selectMediaIndex='selectMediaIdx'
        :selectMediaList='selectMediaList' />

    <!-- notification -->
    <Notification :NotificationQueue='NotificationQueue'/>

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

.contents {
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

.chatReplyContainer:hover {
    cursor: pointer;
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
    padding: 5px 5px;
    border-radius: 10px;
    position: relative;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    border: 0.5px solid rgba(0, 0, 0, 0.1);
}

@keyframes fade {
    0% {
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    }

    10% {
        box-shadow: 0px 0px 10px 5px rgba(148, 148, 148, 0.6);
    }

    90% {
        box-shadow: 0px 0px 10px 5px rgba(148, 148, 148, 0.6);
    }

    100% {
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    }
}

.chatBubbleAnimation {
    opacity: 1;
    animation: fade 2s linear;
    z-index: 1;
}

.chatBubble:hover .menuToggler {
    display: flex;
}

.chatBubbleInBound {
    left: 10px;
    max-width: 60%;
    min-width: 10%;
    background: v-bind(inBoundMsgBubbleColor);
    overflow-x: hidden;
}

.chatBubbleoutBound {
    right: 10px;
    max-width: 60%;
    min-width: 10%;
    background: v-bind(outBoundMsgBubbleColor);
    overflow-x: hidden;
}

.chatBubbleTime {
    background: v-bind(timeBubbleColor);
    border: 0.5px solid rgba(101, 61, 61, 0.2);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    width: fit-content;
    margin: 10px 0px 0px 0px;
}

.chatBubbleSmallMargin {
    padding: 3px 0px 0px 0px;
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

    margin: 10px 10px;
}

.bigChatTextContainer {
    padding-top: 10px;
}

.noOverflow {
    width: calc(100% - 1em);
    overflow-wrap: anywhere;
    white-space: normal;
}

.onlyEmoji {
    font-size: xx-large;
}

.deletedMessage {
    font-size: small;
    color: v-bind(timestampColor)
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
    color: v-bind(timestampColor);
}

.iconContainer {
    padding: 0px 5px;
    color: #1E90FF;
}

.timestampContainerBig {
    margin: 5px 10px;
    width: fit-content;
    flex-direction: column;
}

.timestampBig {
    white-space: nowrap;
    width: fit-content;
    font-size: small;
    color: v-bind(timestampColor);
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
    background: v-bind(inBoundMsgBubbleColor);
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
    color: v-bind(iconColor);
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
    background: v-bind(inBoundMsgBubbleColor);
    box-shadow: 0px 0px 20px 20px v-bind(inBoundMsgBubbleColor);
}

.menuTogglerOutBound {
    background: v-bind(outBoundMsgBubbleColor);
    box-shadow: 0px 0px 20px 20px v-bind(outBoundMsgBubbleColor);
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

.mediaContainer {
    overflow-y: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.mediaContainer:hover {
    cursor: pointer;
}

.imgSquareContainer {
    height: 150px;
    width: 150px;
    margin-right: 5px;
}

img {
    border-radius: 5px;

    overflow: hidden;
}

img:hover {
    cursor: pointer;
}

.chatSettingsContanier {
    position: relative;
    top: v-bind(floatMenuPositionY + 'px');
    right: v-bind(floatMenuPositionX + 'px');

    z-index: 2;
}

.menu {
    position: absolute;
    width: fit-content;
    padding: 0px;
    right: 10px;
    background-color: v-bind(backgroundColor);
    border-radius: 5px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
}


.menuContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.menuContainer:hover {
    background-color: v-bind(hoverColor);
    cursor: pointer;
}

.menuTimestampLong {
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
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
    justify-content: flex-start;
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