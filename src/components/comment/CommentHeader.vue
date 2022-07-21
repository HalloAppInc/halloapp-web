<script setup lang="ts">
import { ref, computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'

import { useMainStore } from '../../stores/mainStore'

import { useI18n } from 'vue-i18n'

const props = defineProps(['postID'])

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const colorStore = useColorStore()

const mainStore = useMainStore()

const hoverColor = computed(() => {
    return colorStore.hover
})

const lineColor = computed(() => {
    return colorStore.line
})

const textColor = computed(() => {
    return colorStore.text
})

const headerColor = computed(() => {
    return colorStore.header
})

const iconColor = computed(() => {
    return colorStore.icon
})

const backgroundColor = computed(() => {
    return colorStore.background
})
</script>

<template>

    <div class='commentHeader'>

        <div class='container'>
           
            <div class='iconContainer' @click="$emit('backClick')">
                <div class='iconShadow'>
                    <font-awesome-icon v-if='!mainStore.isMobile' :icon="['fas', 'xmark']" style="font-size: 25px;"/>
                    <font-awesome-icon v-else :icon="['fas', 'angle-left']" style="font-size: 25px;"/>
                </div>
            </div>
            
            <div class='titleContainer'>
                Comments ({{ postID }})
            </div>

            <div class='iconContainer'>
            </div>

        </div>
    </div>

</template>

<style scoped>

.commentHeader {
    overflow-y: auto;
    overflow-x: hidden;
    
    height: 100%;
    background-color: rgb(243, 243, 240);
}

.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.leftGutter {
    flex: 0 0 10px;
}

.rightGutter {
    flex: 0 0 10px;
}

.avatarContainer {
    flex: 0 0 70px;
    padding: 5px 0px 5px 0px;
}

.avatar {
    width: 40px;
    height: 40px;

    background-color: lightgray;
    border-radius: 50%;
}

.iconContainer {
    flex: 0 0 50px;
    padding: 5px 0px 5px 0px;
    color: v-bind(iconColor);

    display: flex;
    justify-content: center;
}

.iconContainer:hover {
    cursor: pointer;
}

.iconShadow {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50%;
}

.iconShadow:hover {
    background-color: v-bind(hoverColor);
}

.titleContainer {
    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 14px;

    color: v-bind(iconColor);

    display: flex;
    justify-content: center;
    align-items: center;
}

.verticalLine {
    border-right: 1px solid rgb(200, 200, 200);
    height: 30px;
    margin: 10px 30px;
}

</style>
