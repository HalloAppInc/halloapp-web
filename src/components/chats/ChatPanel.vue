<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

import { useI18n } from 'vue-i18n'

import { useColorStore } from '../../stores/colorStore'
import { useTimeformatter } from '../../composables/timeformatter'

nextTick(() => {
    handleScroll()
    gotoBottom('auto')
    new ResizeObserver(setChatPanelHeight).observe(content.value!)
})

const colorStore = useColorStore()

const { formatTime } = useTimeformatter()

const { locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const chatPanelHeight = ref(0)

const props = defineProps(['messageList'])

const content = ref<HTMLElement | null>(null)

let handleScrollTimer: any

const showJumpDownButton = ref(false)

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
            let time = formatTime(parseInt(result[i].timestamp), <string>locale.value)
            let res = appendSpaceForMsgInfo(props.messageList[i].message, time, result[i].type == 'outBound')
            result[i].message = res[0]
            result[i].font = res[1]
        }
    }

    return result
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
watch(messageNumber, () => {
    nextTick(() => {
        gotoBottom('smooth')
        handleScroll()
    });
})

watch(chatPanelHeight, () => { 
    nextTick(() => {
        gotoBottom('auto')
    });
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

        // find the timestamp in msg bubble
        let timestampEl = closestElement?.getElementsByClassName('timestamp')[0] as HTMLDivElement

        if (!timestampEl) {
            // find the timestamp in static timestamp bubble
            timestampEl = closestElement?.getElementsByClassName('timestampBig')[0] as HTMLDivElement
        }

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
</script>

<template>
    <div id='contents' ref='content' @scroll='handleScroll()'>
        <!-- chat msg -->
        <div class='containerChat' v-for='(value, idx) in data' id='panel'>
            <!-- inbound msg -->
            <div v-if="value.type == 'inBound'" class='contentTextBody contentTextBodyInBound'
                :class="idx == 0 || (idx != 0 && data[idx - 1].type != 'inBound') ? 'chatBubbleBigMargin' : 'chatBubbleSmallMargin'">
                <div class='chatBubble chatBubbleInBound'>
                    <!-- toggler -->
                    <div class='menuToggler menuTogglerInBound'>
                        <div class='togglerIconContainer'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>
                    <!-- media -->
                    <div class='mediaContainer' v-if='value.media != ""'>
                        <img :src='value.media' />
                    </div>
                    <!-- text -->
                    <div class='chatTextContainer chatTextContainerInBound'>
                        <span v-html='value.message' :class="value.font ? 'onlyEmoji' : 'noOverflow'">
                        </span>
                    </div>
                    <!-- timestamp -->
                    <div class='msgInfoContainer'>
                        <div class='msgInfoContent'>
                            <div class='timestamp'>
                                {{ formatTime(parseInt(value.timestamp), locale) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- outBound msg -->
            <div v-else-if="value.type == 'outBound'" class='contentTextBody contentTextBodyOutBound'
                :class="idx == 0 || (idx != 0 && data[idx - 1].type != 'outBound') ? 'chatBubbleBigMargin' : 'chatBubbleSmallMargin'">
                <div class='chatBubble chatBubbleoutBound'>
                    <!-- toggler -->
                    <div class='menuToggler menuTogglerOutBound'>
                        <div class='togglerIconContainer'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>
                    <!-- media -->
                    <div class='mediaContainer' v-if='value.media != ""'>
                        <img :src='value.media' />
                    </div>
                    <!-- text -->
                    <div class='chatTextContainer chatTextContainerOutBound'>
                        <span v-html='value.message' :class="value.font ? 'onlyEmoji' : 'noOverflow'"
                            @click="gotoProfile($event)">
                        </span>
                    </div>
                    <!-- timestamp -->
                    <div class='msgInfoContainer'>
                        <div class='msgInfoContent'>
                            <div class='timestamp'>
                                {{ formatTime(parseInt(value.timestamp), locale) }}
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
                            {{ formatTime(parseInt(value.timestamp), locale) }}
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
                <div class='buttonIconContainer' @click=''>
                    <font-awesome-icon :icon="['fas', 'angle-down']" size='lg' />
                </div>
            </div>
        </transition>
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
    min-width: 100px;
    height: 100%;
    overflow-y: scroll;
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

.contentTextBody {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.contentTextBodyInBound {
    justify-content: flex-start;
}

.contentTextBodyOutBound {
    justify-content: flex-end;

}

.contentTextBodyTime {
    justify-content: center;
}

.chatBubble {
    padding: 5px 5px;
    border-radius: 10px;
    position: relative;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    border: 0.5px solid rgba(0, 0, 0, 0.1);
}

.chatBubble:hover .menuToggler {
    display: flex;
}

.chatBubbleInBound {
    max-width: 50%;
    min-width: 2%;
    background: v-bind(inBoundMsgBubbleColor);
    overflow-x: hidden;
    margin: 0px 30px;
}

.chatBubbleoutBound {
    max-width: 50%;
    min-width: 10%;
    background: v-bind(outBoundMsgBubbleColor);
    overflow-x: hidden;
    margin: 0px 30px;
}

.chatBubbleTime {
    background: v-bind(timeBubbleColor);
    border: 0.5px solid rgba(101, 61, 61, 0.2);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    width: fit-content;
    margin: 10px 30px 0px 0px;
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

    margin: 10px 10px;
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
    z-index: 1;
}

.buttonContainer {
    position: fixed;
    right: 10px;
    bottom: 100px;

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

.menuToggler:hover {
    cursor: pointer;
}

.togglerIconContainer {
    color: #1E90FF;
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
    width: 100%;
}

img {
    border-radius: 5px;
    max-width: 100%;
}
</style>