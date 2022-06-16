<script setup lang="ts">
import { computed } from 'vue'

import timeformatter from '../../common/timeformatter'

import { useI18n } from 'vue-i18n'

import { useColorStore } from '../../stores/colorStore'

const colorStore = useColorStore()

const { locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const props = defineProps(['messageList'])

const textColor = computed(() => {
    return colorStore.text
})

const outboundMsgBubble = computed(() => {
    return colorStore.outboundMsgBubble
})

const inboundMsgBubble = computed(() => {
    return colorStore.inboundMsgBubble
})

const timeBubble = computed(() => {
    return colorStore.timeBubble
})

const timestamp = computed(() => {
    return colorStore.timestamp
})
</script>

<template>

    <div class='containerChat' v-for='value in props.messageList'>

        <!-- inbound msg -->
        <div v-if="value.type == 'inbound'" class='contentTextBody contentTextBody-inbound'>
            <div class='chatBubble chatBubble-inbound'>
                <div class='chatTextContainer chatTextContainer-inbound'>
                    <!-- show message content -->
                    <span v-html="value.message+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'" class='noOverflow'></span>
                </div>
                <div class='timestampContainer'>
                    <div class='timestamp'>
                        {{ timeformatter.format(parseInt(value.timestamp), locale) }}
                    </div>
                </div>
            </div>

        </div>

        <!-- outbound msg -->
        <div v-else-if="value.type == 'outbound'" class='contentTextBody contentTextBody-outbound'>
            <div class='chatBubble chatBubble-outbound'>
                <div class='chatTextContainer chatTextContainer-outbound'>
                    <!-- show message content -->
                    <span v-html="value.message+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'" class='noOverflow'> </span>
                </div>
                <div class='timestampContainer'>
                    <div class='timestamp'>
                        {{ timeformatter.format(parseInt(value.timestamp), locale) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- timestamp -->
        <div v-else-if="value.type == 'timestamp'" class='contentTextBody contentTextBody-time'>
            <div class='chatBubble chatBubble-time'>
                <div class='timestampContainerBig'>
                    <div class='timestampBig'>
                        {{ timeformatter.format(parseInt(value.timestamp), locale) }}
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
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

.contentTextBody-inbound {
    justify-content: flex-start;
}

.contentTextBody-outbound {
    justify-content: flex-end;

}

.contentTextBody-time {
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

.chatBubble-inbound {
    background: v-bind(inboundMsgBubble);
}

.chatBubble-outbound {
    background: v-bind(outboundMsgBubble);
}

.chatBubble-time {
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

.timestampContainer {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 0px 15px 10px 10px;
    flex-direction: column;
    align-self: flex-end;
}

.timestamp {
    font-size: x-small;
    color: v-bind(timestamp);
}

.timestampContainerBig {
    flex-direction: column;
}

.timestampBig {
    font-size: small;
    color: v-bind(timestamp);
}
</style>