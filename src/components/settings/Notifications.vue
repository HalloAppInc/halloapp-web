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
    if (offset != undefined) {
        return -1 * offset
    }
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
const borderlineColor = computed(() => {
    return colorStore.borderline
})
const headerColor = computed(() => {
    return colorStore.header
})
</script>

<template>
    <transition name='notifications'>
        <div v-if="mainStore.settingsPage == 'notifications'" ref='notificationMenu'>
            <div id='header'>
                <div class='contentMenuTitle'>
                    <div class='iconContainer' @click="mainStore.gotoSettingsPage('')">
                        <font-awesome-icon :icon="['fas', 'arrow-left']" size='lg' />
                    </div>
                    <div class='textContainerBig'>
                        <div class='contentTextBodyBig'>
                            {{ t('settings.notifications') }}
                        </div>
                    </div>
                </div>
            </div>

            <div class='content'>
                <div id='menu'>
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
            </div>
        </div>
    </transition>

</template>

<style scoped>
/* animation in from right to left, out from left to right */
.notifications-enter-active {
    transition: all 0.15s ease-in 0.15s;
}

.notifications-leave-active {
    transition: all 0.15s ease-out;
}

.notifications-enter-from {
    transform: translateX(200px);
    opacity: 0;
}

.notifications-leave-from {
    transform: translateY(v-bind(offsetTop + 'px'));
    opacity: 1;
}

.notifications-leave-to {
    transform: translateX(200px) translateY(v-bind(offsetTop + 'px'));
    opacity: 0;
}

*::-webkit-scrollbar {
    width: 5px;
}

*::-webkit-scrollbar-track {
    background: white;      /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);       /* color of the scroll thumb */

    border: 0px solid white;        /* creates padding around scroll thumb */
}

#menu {
    background-color: v-bind(backgroundColor);
    height: 100%;
}

#header {
    flex: 0 0 50px;
    background-color: v-bind(headerColor);
    padding: 10px;
}

.content {
    background-color: v-bind(backgroundColor);
}

.contentMenuTitle {
    display: flex;
    flex-direction: row;
    background-color: v-bind(headerColor);
    align-items: center;
}

.contentTextBodyBig {
    font-size: large;

    display: flex;
    justify-content: flex-start;
    align-items: center;
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
    margin-right: 20px;
    padding: 5px 30px 5px 30px;
    color: v-bind(iconColor);
    width: 30px;
    height: 30px;
}

.iconContainer:hover {
    cursor: pointer;
}

.textContainer {
    color: v-bind(textColor);
    width: 100%;
    height: 4em;
    padding: 20px 20px 20px 10px;
    border-bottom: 1px solid v-bind(borderlineColor);

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