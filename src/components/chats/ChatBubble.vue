<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

import timeformatter from '../../common/timeformatter'

import { useI18n } from 'vue-i18n'

import { useColorStore } from '../../stores/colorStore'

const colorStore = useColorStore()

const { locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

// jump to bottom when first open
nextTick(() => {
    content.value?.scrollTo(10000, content.value?.scrollHeight)
});

const props = defineProps(['messageList'])

const content = ref<HTMLElement | null>(null)

const biggerFont = ref(true)

const showFloatingTimestamp = ref(false)

const showJumpDownButton = ref(false)

// set floating time stamp's content
const currentMsgTimestamp = ref()

// add extra space after text to fit time stamp and checkmarks
function appendSpaceForMsgInfo(msg: string, time: string, isOutBound: boolean) {
    let width = 0
    let result = ''
    if (isOutBound) {
        width = time.length * 2 + 10
    }
    else {
        width = time.length * 2
    }
    let newDiv = "<span style='padding: 0px " + width + "px;display: inline-block;background-color: red;'></span>" // padding:0px "+ width +"px;
    result = msg.concat(newDiv)

    var patterns = [
        '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
        '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
        '\ud83d[\ude80-\udeff]', // U+1F680 to U+1F6FF
    ]

    let pureText = (msg.replaceAll(new RegExp(patterns.join('|'), 'g'), '') == '')
    let numOfEmoji = msg.split(new RegExp(patterns.join('|'))).length - 1
    biggerFont.value = (numOfEmoji > 0 && numOfEmoji <= 3 && pureText)
    return result
}

const messageNumber = computed(() => {
    return props.messageList.length
})

// lisetn to msg list, when a new msg comes in, scroll to the bottom
watch(messageNumber, () => {
    // notifyMe()
    nextTick(() => {
        content.value?.scrollTo(10000, content.value?.scrollHeight)
    });
})

// when scroll the scroll bar get the scroll bar's current height
// get the value of timestamp of the msg bubble at current floating timestamp's height
function checkHeight() {
    showFloatingTimestamp.value = true
    if (content.value &&
        content.value.scrollTop + content.value.clientHeight < content.value.scrollHeight - 30) {
        showJumpDownButton.value = true
    }
    else {
        showJumpDownButton.value = false
    }
    if (content.value) {
        let ele = document.elementFromPoint(550, 60)
        // get timestamp in this div
        if (ele?.className.includes('Time')) {
            let child = ele.childNodes[0].childNodes[0].childNodes[0]
            currentMsgTimestamp.value = child.textContent
        }
        else {
            let child = ele?.childNodes[0].childNodes[2].childNodes[0].childNodes[0]
            currentMsgTimestamp.value = child?.textContent
        }
    }
}

// jump to bottom
function gotoBottom() {
    content.value?.scrollTo(10000, content.value?.scrollHeight)
}

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

</script>

<template>
    <div id='contents' ref='content' @scroll='checkHeight()'>
        <!-- chat msg -->
        <div class='containerChat' v-for='value in props.messageList' id='panel'>
            <!-- inbound msg -->
            <div v-if="value.type == 'inBound'" class='contentTextBody contentTextBodyInBound'>
                <div class='chatBubble chatBubbleInBound'>
                    <div class='menuToggler menuTogglerInBound'>
                        <div class='togglerIconContainer'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>
                    <div class='chatTextContainer chatTextContainerInBound'>
                        <!-- show message content -->
                        <span v-html='appendSpaceForMsgInfo(value.message, value.timestamp, false)'
                            :class="biggerFont ? 'onlyEmoji' : 'noOverflow'">
                        </span>
                    </div>
                    <div class='msgInfoContainer'>
                        <div class='msgInfoContent'>
                            <div class='timestamp'>
                                {{ timeformatter.format(parseInt(value.timestamp), locale) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- outBound msg -->
            <div v-else-if="value.type == 'outBound'" class='contentTextBody contentTextBodyOutBound'>
                <div class='chatBubble chatBubbleoutBound'>
                    <div class='menuToggler menuTogglerOutBound'>
                        <div class='togglerIconContainer'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>
                    <div class='chatTextContainer chatTextContainerOutBound'>
                        <!-- show message content -->
                        <span v-html='appendSpaceForMsgInfo(value.message, value.timestamp, true)'
                            :class="biggerFont ? 'onlyEmoji' : 'noOverflow'">
                        </span>
                    </div>
                    <div class='msgInfoContainer'>
                        <div class='msgInfoContent'>
                            <div class='timestamp'>
                                {{ timeformatter.format(parseInt(value.timestamp), locale) }}
                            </div>
                            <div class='iconContainer'>
                                <font-awesome-icon :icon="['fas', 'check-double']" size='xs' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- timestamp -->
            <div v-else-if="value.type == 'timestamp'" class='contentTextBody contentTextBodyTime'>
                <div class='chatBubble chatBubbleTime'>
                    <div class='msgInfoContainerBig'>
                        <div class='timestampBig'>
                            {{ timeformatter.format(parseInt(value.timestamp), locale) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- floating timestamp -->
        <div class='containerFloatingTimestamp' v-show='showFloatingTimestamp'>
            <div class='contentTextBody contentTextBodyTime'>
                <div class='chatBubble chatBubbleTime'>
                    <div class='msgInfoContainerBig'>
                        <div class='timestampBig'>
                            {{ currentMsgTimestamp }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- jump down button -->
        <transition name='button'>
            <div class='buttonContainer' v-show='showJumpDownButton' @click='gotoBottom()'>
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
    width: 5px;
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
    overflow-x: auto;
    overflow-y: auto;
}

.containerChat {
    display: flex;
    flex-direction: column;
    padding: 0px;
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

.noOverflow {
    max-width: 450px;
    /* how to decide the width? */
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
}

.onlyEmoji {
    font-size: xx-large;
}

.chatBubble {
    display: flex;
    flex-direction: row;
    padding: 10px 15px;
    margin: 10px 30px;
    border-radius: 14px;
    position: relative;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    width: fit-content;
    max-width: 50%;
    overflow-x: hidden;
}

.chatBubbleInBound {
    background: v-bind(inBoundMsgBubble);
}

.chatBubbleoutBound {
    background: v-bind(outBoundMsgBubble);
}

.chatBubble:hover .menuToggler {
    display: flex;
}

.chatBubbleTime {
    background: v-bind(timeBubble);
    border: 0.5px solid rgba(101, 61, 61, 0.2);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
}

.chatTextContainer {
    color: v-bind(textColor);
    font-weight: 500;
    font-size: 15px;
    line-height: 120%;

    display: flex;
    align-items: center;
    letter-spacing: 0.02em;

    /* color: rgba(0, 0, 0, 0.8); */
    margin: 5px 0px;
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
    top: 50px;
    right: calc(50% - 4em);
    z-index: 1;
    width: fit-content;
    margin: 0px 5px;
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
    background-color: white;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

    align-content: center;
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

.menuToggler:hover {
    cursor: pointer;
}

.togglerIconContainer {
    color: #1E90FF;
}
</style>