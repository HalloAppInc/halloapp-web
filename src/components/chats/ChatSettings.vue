<script setup lang="ts">
import { ref, computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

const colorStore = useColorStore()
const mainStore = useMainStore()

const colorList = computed(() => {
    return colorStore.colorList
})
const chatBackground = computed(() => {
    return colorStore.chatBackground
})
const headerColor = computed(() => {
    return colorStore.header
})
const textColor = computed(() => {
    return colorStore.text
})
const iconColor = computed(() => {
    return colorStore.icon
})

const selectedColor = ref(chatBackground.value)

function selectColor(color: string) {
    selectedColor.value = color
    colorStore.chatBackground = color
}
</script>

<template>

    <div id='wrapper' v-if="mainStore.chatPage == 'settings'">
        <div id='header'>
            <div class='contentMenuTitle'>
                <div class='iconContainer' @click="mainStore.chatPage = 'chat'">
                    <font-awesome-icon :icon="['fas', 'arrow-left']" size='lg' />
                </div>
                <div class='textContainerBig'>
                    <div class='contentTextBodyBig'>
                        Change Chat Background Color
                    </div>
                </div>
            </div>
        </div>

        <div id='content' ref='content'>
            <div class='container'>
                <div class='colorBlockContainer' v-for='value in colorList' :style="{ 'background-color': value }"
                    :class="{ 'selected': selectedColor == value }" @click='selectColor(value)'>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
#wrapper {
    position: fixed;
    z-index: 9998;
    top: 0;
    right: 0;
    width: 30%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: v-bind(chatBackground);
}

#header {
    flex: 0 0 50px;
    background-color: v-bind(headerColor);
    padding: 10px;
}

#content {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: v-bind(chatBackground);
}

.contentMenuTitle {
    display: flex;
    flex-direction: row;
    background-color: v-bind(headerColor);
    align-items: center;
}

.iconContainer {
    margin-right: 20px;
    padding: 5px 30px 5px 30px;
    color: v-bind(iconColor);
    width: 30px;
    height: 30px;
}

.iconContainer:hover {
    cursor: pointer;
}

.textContainerBig {
    color: v-bind(textColor);
    margin-top: 0px;
    width: 100%;
    padding: 2px 2px 2px 2px;


    display: flex;
    width: 100%;
    align-items: center;
}

.contentTextBodyBig {
    font-size: large;

    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    margin: 30px 30px;
}

.colorBlockContainer {
    width: 80px;
    height: 80px;
    padding: 5px;
    margin: 10px 10px;
}

.colorBlockContainer:hover {
    box-shadow: inset 0 0 0 5px white;
    cursor: pointer;
}

.selected {
    box-shadow: inset 0 0 0 5px #1E90FF;
}

.selected:hover {
    box-shadow: inset 0 0 0 5px #1E90FF;
}
</style>