<script setup lang="ts">
import { ref, computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'

const colorStore = useColorStore()

const props = defineProps(['quoteMessage'])

const textColor = computed(() => {
    return colorStore.text
})
const backgroundColor = computed(() => {
    return colorStore.background
})
const iconColor = computed(() => {
    return colorStore.icon
})
</script>

<template>

    <!-- Quote -->
    <div class='quoteContainer'>
        <div class='quoteMessageContainer'>
            <div class='contentHeader'>
                <div class='contentTitle'>
                    {{ quoteMessage.sender }}
                </div>
            </div>
            <div class='contentBody'>
                <!-- if attached media -->
                <div class='iconContainer' v-if="quoteMessage.media">
                    <font-awesome-icon :icon="['fas', 'camera']" size='xs' />
                </div>
                <div class='TextContainer'>
                    <span v-html='quoteMessage.message'></span>
                </div>
            </div>
        </div>
        <div class='attachMediaContainer' v-if='quoteMessage.media'>
            <img :src='quoteMessage.media'/>
        </div>
    </div>

</template>

<style scoped>
.quoteContainer {
    height: fit-content;
    background-color: rgb(0,0,0,0.05);
    border-left: 5px solid #6495ED;;
    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.quoteMessageContainer {
    max-height: 110px;
    height: fit-content;
    overflow: hidden;
    flex-grow: 100;
}

.attachMediaContainer {
    overflow-y: hidden;
    height: auto;
    width: 15%;

    background-color: #FFFFFF;
}

img {
    height: 100%;
    width: 100%;
}

.contentHeader {
    margin: 20px 15px 5px 15px;
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
    overflow: hidden;
    width: fit-content;
}
</style>