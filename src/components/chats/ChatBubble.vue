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

const myChatBubble = computed(() => {
    return colorStore.myChatBubble
})

const otherChatBubble = computed(() => {
    return colorStore.othersChatBubble
})

const messageBubble = computed(() => {
    return colorStore.messageBubble
})

const timestamp = computed(() => {
    return colorStore.timestamp
})
</script>

<template>

    <div class='containerChat' v-for='value in props.messageList'>
        <div class='contentTextBody' :class="'contentTextBody-' + value.side">
            <div class='chatBubble' :class="'chatBubble-' + value.side">
                <div class='chatTextContainer' v-if="value.side != 'middle'">
                    <!-- show message content -->
                    <span v-html='value.message'> </span>
                </div>
                <div :class="'timestampContainer-' + value.side">
                    <div class='timestamp'>
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

.contentTextBody-left {
    justify-content: flex-start;
}

.contentTextBody-right {
    justify-content: flex-end;

}

.contentTextBody-middle {
    justify-content: center;
}

.chatBubble {
    padding: 10px 14px;
    margin: 10px 30px;
    border-radius: 14px;
    position: relative;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    width: fit-content;
    max-width: 50%;
}

.chatBubble-left {
    background: v-bind(otherChatBubble);
}

.chatBubble-right {
    background: v-bind(myChatBubble);
}

.chatBubble-middle {
    background: v-bind(messageBubble);
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
    flex-direction: row;
}

.timestampContainer-left {
    text-align: left;
}

.timestampContainer-right {
    text-align: right;
}

.timestamp {
    font-size: small;
    color: v-bind(timestamp);
}
</style>