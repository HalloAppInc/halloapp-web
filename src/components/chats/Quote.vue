<script setup lang="ts">
import { computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'

import { useHAMediaResize } from '../../composables/haMediaResize'

import hal from '../../common/halogger'

const colorStore = useColorStore()

const { setQuoteMediaSize } = useHAMediaResize()

const props = defineProps(['quoteMessage'])

const quoteMedia = computed(() => {
    let res = setQuoteMediaSize(props.quoteMessage.media)
    let result = {
        'url': props.quoteMessage.media.url,
        'width': res?.mediaItemWidth,
        'height': res?.mediaItemHeight 
    }
    // hal.log('Quote/compute quoteMedia/', result)
    return result
})

const textColor = computed(() => {
    return colorStore.text
})
const iconColor = computed(() => {
    return colorStore.icon
})
</script>

<template>

    <!-- Quote -->
    <div class='quoteContainer'>

        <div class='quoteMessageContainer'>

            <!-- sender infomation -->
            <div class='contentHeader'>
                <div class='contentTitle'>
                    {{ quoteMessage.sender }}
                </div>
            </div>

            <!-- message details -->
            <div class='contentBody'>
                <!-- if attached media -->
                <div class='iconContainer' v-if='quoteMessage.media'>
                    <font-awesome-icon :icon="['fas', 'camera']" size='xs' />
                </div>
                <div class='TextContainer'>
                    <span v-html='quoteMessage.text' class='noOverFlow'></span>
                </div>
            </div>

        </div>
        
        <div class='attachMediaContainer' v-if='quoteMessage.media'>
            <img class='imgSmall' :height='quoteMedia.height' :width='quoteMedia.width' :src='quoteMedia.url'/>
        </div>

    </div>

</template>

<style scoped>
.quoteContainer {
    height: fit-content;
    background-color: rgb(0, 0, 0, 0.05);
    border-left: 5px solid #6495ED;
    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.quoteMessageContainer {
    height: 80px;
    width: calc(100% - 80px);
    overflow: hidden;
    flex-grow: 100;
}

.attachMediaContainer {
    height: 80px;
    width: 80px;
    overflow: hidden;

    background-color: #FFFFFF;
}

.imgSmall {
    overflow: hidden;
}

.contentHeader {
    margin: 20px 15px 5px 15px;
    width: fit-content;
    display: flex;

    justify-content: flex-start;
}

.contentTitle {
    color: v-bind(textColor);
    font-weight: 400;
    font-size: 10px;
    flex: 1 1 auto;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;

    user-select: none;
}

.contentBody {
    margin: 5px 10px 20px 10px;
    max-width: 60%;

    color: v-bind(textColor);
    font-size: small;

    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}

.iconContainer {
    margin: 0px 5px;
    width: fit-content;
    color: v-bind(iconColor);
}

.TextContainer {
    margin: 0px 5px;
    max-height: 30px;
    min-width: 100px;
    overflow: hidden;

    /* wrap text when it is too long */
    overflow-wrap: anywhere;
    white-space: normal;
}

.noOverFlow {
    overflow-wrap: anywhere;
    white-space: normal;
}
</style>