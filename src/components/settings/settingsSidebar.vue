<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

import popup from './Popup.vue'
import mainMenu from './Main.vue'
import helpMenu from './help.vue'
import notificationsMenu from './Notifications.vue'

import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

const mainStore = useMainStore()
const colorStore = useColorStore()

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const backgroundColor = computed(() => {
    return colorStore.background
})

const headerColor = computed(() => {
    return colorStore.header
})

const hoverColor = computed(() => {
    return colorStore.hover
})

const textColor = computed(() => {
    return colorStore.text
})

const borderlineStyle = computed(() => {
    return "1px solid " + colorStore.borderline
})

const secondaryTextColor = computed(() => {
    return colorStore.secondaryText
})

const iconColor = computed(() => {
    return colorStore.icon
})

</script>


<template>
    <div class="wrapper">
        <div id="header">
            <div class="contentMenuTitle" v-show="mainStore.settingsPage != '' && mainStore.settingsPage != 'theme'">
                <div class="iconContainer" @click="mainStore.gotoSettingsPage('')">
                    <font-awesome-icon :icon="['fas', 'arrow-left']" />
                </div>
                <div class="textContainerBig">
                    <div class="contentTextBodyBig" v-show="mainStore.settingsPage == 'notifications'">
                        {{ t('settings.notifications') }}
                    </div>
                    <div class="contentTextBodyBig" v-show="mainStore.settingsPage == 'privacy'">
                        {{ t('settings.privacy') }}
                    </div>
                    <div class="contentTextBodyBig" v-show="mainStore.settingsPage == 'security'">
                        {{ t('settings.security') }}
                    </div>
                    <div class="contentTextBodyBig" v-show="mainStore.settingsPage == 'help'">
                        {{ t('settings.help') }}
                    </div>
                </div>
            </div>
        </div>
        <div class="content">

            <!--main menu -->
            <mainMenu />
            <!-- help menu -->
            <helpMenu />
            <!-- notifications menu -->
            <notificationsMenu />

        </div>

        <popup />
    </div>
</template>

<style scoped>
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

.wrapper {
    background-color: v-bind(backgroundColor);

    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    overflow: hidden;
}

#header {
    flex: 0 0 50px;
    background-color: v-bind(headerColor);
    padding: 10px;
}

.content {
    background-color: v-bind(backgroundColor);
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
    margin-top: 10px;
    width: 100%;
    padding: 20px 20px 20px 10px;
    border-bottom: 1px solid;


    display: flex;
    width: 100%;
    align-items: center;
}

.iconContainer {
    padding: 0px 30px 0px 30px;
    float: left;
    color: v-bind(iconColor);
}

.iconContainer:hover{
    cursor: pointer;
}

.contentTextBody {
    font-size: larger;

    display: flex;
    justify-content: flex-start;
    align-items: center;
}


.contentMenuTitle {
    display: flex;
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
</style>