<script setup lang="ts">
import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

import { useI18n } from 'vue-i18n'

import { ref, computed } from 'vue'

const colorStore = useColorStore()
const mainStore = useMainStore()

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const notificationMenu = ref<HTMLDivElement>()

// find the offset to the top
const offsetTop = computed(() => {
    var offset = notificationMenu.value?.offsetTop
    if (offset != undefined)
        return -1 * offset + 50
})

const backgroundColor = computed(() => {
    return colorStore.background
})

const textColor = computed(() => {
    return colorStore.text
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

</script>

<template>
    <transition>
        <div v-if="mainStore.settingsPage == 'notifications'" id='menu' ref='notificationMenu'>
            <!-- sounds -->
            <div class='container'>
                <div class='iconContainer'>
                    <input type='checkbox' id='sounds' v-model='mainStore.sounds'>
                </div>
                <div class='textContainer' @click=''>
                    <div class='contentTextBody'>
                        {{ t('notifications.sounds') }}
                    </div>
                </div>
            </div>
            <!-- desktop alerts -->
            <div class='container'>
                <div class='iconContainer'>
                    <input type='checkbox' id='desktopAlerts' v-model='mainStore.desktopAlerts'>
                </div>
                <div class='textContainer' @click=''>
                    <div class='contentTextBody'>
                        {{ t('notifications.desktopAlerts') }}
                    </div>
                </div>
            </div>
        </div>
    </transition>

</template>

<style scoped>
/* animation in from right to left, out from left to right */
.v-enter-active {
    transition: all 0.25s ease-in 0.25s;
}

.v-leave-active {
    transition: all 0.25s ease-out;
}

.v-enter-from {
    transform: translateX(200px);
    opacity: 0;
}

.v-leave-from {
    transform: translateY(v-bind(offsetTop+'px'));
    opacity: 1;
}

.v-leave-to {
    transform: translateX(200px) translateY(v-bind(offsetTop+'px'));
    opacity: 0;
}

*::-webkit-scrollbar {
    width: 5px;
}

*::-webkit-scrollbar-track {
    background: white;
    /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);
    /* color of the scroll thumb */

    border: 0px solid white;
    /* creates padding around scroll thumb */
}

#menu {
    background-color: v-bind(backgroundColor);
    height: 100%;
}

.container {
    display: flex;
    flex-direction: horizontal;
    padding: 0px;
    align-items: center;
}

.container:hover {
    background-color: v-bind(hoverColor);
    cursor: pointer;
}

.iconContainer {
    padding: 0px 30px 0px 30px;
    color: v-bind(iconColor);
}

.textContainer {
    color: v-bind(textColor);
    width: 100%;
    height: 4em;
    padding: 20px 20px 20px 10px;
    border-bottom: 1px solid v-bind(lineColor);

    display: flex;
    align-items: center;
}

.contentTextBody {
    font-size: large;

    display: flex;
    justify-content: flex-start;
    align-items: center;
}
</style>