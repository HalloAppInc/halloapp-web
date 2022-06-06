<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

const mainStore = useMainStore()
const colorStore = useColorStore()

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const hoverColor = computed(() => {
    return colorStore.hover
})

const textColor = computed(() => {
    return colorStore.text
})

const backgroundColor = computed(() => {
    return "1px solid " + colorStore.background
})

const secondaryTextColor = computed(() => {
    return colorStore.secondaryText
})

const iconColor = computed(() => {
    return colorStore.icon
})

const lineColor = computed(() => {
    return colorStore.line
})
</script>

<template>
    <transition>
        <div v-if="mainStore.settingsPage == '' || mainStore.settingsPage == 'theme'" id='menu' key='1'>
            <!-- user profile -->
            <div class="container">
                <div class="profileContent">
                    <div class="avatarContainer">
                        <div class="avatar"></div>
                    </div>
                    <div class="headerContent">
                        <div class="contentTitle">
                            User Name
                        </div>
                        <div class="contentBody">
                            Available
                        </div>
                    </div>
                </div>
            </div>
            <!-- menu -->
            <div class="container">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'bell']" size="lg" />
                </div>
                <div class="textContainer" @click="mainStore.gotoSettingsPage('notifications')">
                    <div class="contentTextBody">
                        {{ t('settings.notifications') }}
                    </div>
                </div>
            </div>

            <div class="container" @click="mainStore.gotoSettingsPage('privacy')">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'lock']" size="lg" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('settings.privacy') }}
                    </div>
                </div>
            </div>

            <div class="container" @click="mainStore.gotoSettingsPage('security')">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'shield-halved']" size="lg" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('settings.security') }}
                    </div>
                </div>
            </div>

            <div class="container" @click="mainStore.gotoSettingsPage('theme')">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'circle-half-stroke']" size="lg" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('settings.theme') }}
                    </div>
                </div>
            </div>

            <div class="container" @click="mainStore.gotoSettingsPage('help')">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'circle-question']" size="lg" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('settings.help') }}
                    </div>
                </div>
            </div>
        </div>
    </transition>

</template>

<style scoped>
/* animation in from left to right, out from right to left */
.v-enter-active {
    transition: all 0.25s ease-in;
}

.v-leave-active {
    transition: all 0.25s ease-out;
}

.v-enter-from {
    transform: translateX(-200px);
    opacity: 0;
}

.v-leave-from {
    opacity: 1;
}

.v-leave-to {
    transform: translateX(-200px);
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

.avatarContainer {
    flex: 0 0 100px;
    padding: 10px 0px 10px 10px;
}

.avatar {
    width: 80px;
    height: 80px;
    float: left;

    background-color: lightgray;
    border-radius: 50%;
}

.profileContent {
    margin-top: 5px;
    width: 100%;
    padding: 10px 10px 10px 5px;

    color: #3b4a54;

    display: flex;
    width: 100%;
    flex-direction: row;

    user-select: none;

    overflow: hidden;
}

.headerContent {
    display: flex;
    flex-direction: column;
}

.contentTitle {
    color: v-bind(textColor);
    font-weight: 600;
    font-size: large;
    padding: 25px 15px 0px 15px;


    flex: 1 1 auto;

    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;

    user-select: none;

    overflow: hidden;
}

.contentBody {
    color: v-bind(secondaryTextColor);
    font-size: large;
    padding: 0px 15px 25px 15px;
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

.iconContainer {
    margin-right: 20px;
    padding: 10px 30px 10px 30px;
    color: v-bind(iconColor);
    width: 45px;
    height: 45px;
}

.contentTextBody {
    font-size: large;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>