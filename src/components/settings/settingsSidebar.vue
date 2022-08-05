<script setup lang="ts">
import { computed, ref } from 'vue'

import { useI18n } from 'vue-i18n'

import MainMenu from './Main.vue'
import HelpMenu from './Help.vue'
import NotificationsMenu from './Notifications.vue'
import PrivacyMenu from './Privacy.vue'
import SecurityMenu from './Security.vue'

import { useColorStore } from '../../stores/colorStore'
import { useMainStore } from '../../stores/mainStore'

const colorStore = useColorStore()
const mainStore = useMainStore()

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const backgroundColor = computed(() => {
    return colorStore.background
})
const boderlineColor = computed(() => {
    return colorStore.borderline
})

const settingsSidebar = ref<HTMLDivElement>()

// find the offset to the top
const offsetTop = computed(() => {
    if (settingsSidebar.value) {
        console.log('*******',settingsSidebar.value.offsetTop)
        let offset = settingsSidebar.value.clientHeight / 2
        console.log(offset)
        return -1 * offset
    }
})
</script>


<template>
    <Transition name='settings'>
        <div class="wrapper" ref='settingsSidebar'>
            <MainMenu />
            <PrivacyMenu />
            <NotificationsMenu />
            <HelpMenu />
            <SecurityMenu />
        </div>  
    </Transition>
</template>

<style scoped>
.settings-enter-active {
    transition: all 0.15s;
}

.settings-leave-active {
    transition: all 2s;
}

.settings-enter-from {
    transform: translateX(-200px);
    opacity: 0;
}

.settings-leave-from {
    transform: translateY(-353px);
    opacity: 1;
}

.settings-leave-to {
    transform: translateX(-200px) translateY(-353px);
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

.wrapper {
    background-color: v-bind(backgroundColor);

    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    overflow: hidden;

    border-right: 1px solid v-bind(boderlineColor);
}
</style>