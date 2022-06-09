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

const privacyMenu = ref<HTMLDivElement>()

// find the offset to the top
const offsetTop = computed(() => {
    var offset = privacyMenu.value?.offsetTop
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

const hoverColor = computed(() => {
    return colorStore.hover
})

const iconColor = computed(() => {
    return colorStore.icon
})

const lineColor = computed(() => {
    return colorStore.line
})

const headerColor = computed(() => {
    return colorStore.header
})
</script>

<template>
    <transition name='privacy'>
        <div v-if="mainStore.settingsPage == 'privacy'" ref='privacyMenu'>
            <div id='header'>
                <div class='contentMenuTitle'>
                    <div class='iconContainer' @click="mainStore.gotoSettingsPage('')">
                        <font-awesome-icon :icon="['fas', 'arrow-left']" size='lg' />
                    </div>
                    <div class='textContainerBig'>
                        <div class='contentTextBodyBig'>
                            {{ t('settings.privacy') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class='content'>
            </div>

        </div>

    </transition>

</template>

<style scoped>
/* animation in from right to left, out from left to right */
.privacy-enter-active {
    transition: all 0.15s ease-in 0.15s;
}

.privacy-leave-active {
    transition: all 0.15s ease-out;
}

.privacy-enter-from {
    transform: translateX(200px);
    opacity: 0;
}

.privacy-leave-from {
    transform: translateY(v-bind(offsetTop + 'px'));
    opacity: 1;
}

.privacy-leave-to {
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

.container:hover {
    background-color: v-bind(hoverColor);
    cursor: pointer;
}

.container {
    display: flex;
    flex-direction: horizontal;
    padding: 0px;
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

.contentTextBody {
    font-size: large;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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
</style>