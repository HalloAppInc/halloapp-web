<script setup lang="ts">
import { ref, computed } from 'vue'

import { useI18n } from 'vue-i18n'

import popup from './Popup.vue'
import help from './Help.vue'
import notifications from './Notifications.vue'

import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

const mainStore = useMainStore()

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const colorStore = useColorStore()

/* const show = computed(() => {
    return mainStore.page == 'settings' || mainStore.page == 'settings-theme'
}) */

const backgroundColor = computed(() => {
    return  colorStore.mainBackground
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

const secondaryTextColor = computed(() =>{
    return colorStore.secondaryText
})

const iconColor = computed(() => {
    return colorStore.icon
})

</script>


<template>
<div class="wrapper">
    <div id="header"> 
        <div class="contentMenuTitle" v-show="mainStore.page != 'settings' && mainStore.page != 'settings-theme'">
            <div class="iconContainer" @click="mainStore.gotoPage('settings')">
                <font-awesome-icon :icon="['fas', 'arrow-left']" />
            </div>
            <div class="textContainerBig">
                <div class="contentTextBodyBig" v-show="mainStore.page == 'settings-notifications'">
                    {{ t('settings.notifications') }}
                </div>
                <div class="contentTextBodyBig" v-show="mainStore.page == 'settings-privacy' ">
                    {{ t('settings.privacy') }}
                </div>
                <div class="contentTextBodyBig" v-show="mainStore.page == 'settings-security'">
                    {{ t('settings.security') }}
                </div>
                <div class="contentTextBodyBig" v-show="mainStore.page == 'settings-help'">
                    {{ t('settings.help') }}
                </div>
            </div>
        </div>
    </div>

    <div class="content">

        <!--main menu -->
        <div id="menu" v-show="mainStore.page == 'settings' || mainStore.page == 'settings-theme'"> 
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
                    <font-awesome-icon :icon="['fas', 'bell']" size="xl"/>
                </div>
                <div class="textContainer" @click="mainStore.gotoPage('settings-notifications')">
                    <div class="contentTextBody">
                        {{ t('settings.notifications') }}
                    </div>
                </div>
            </div>

            <div class="container" @click="mainStore.gotoPage('settings-privacy')">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'lock']" size="xl"/>
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('settings.privacy') }}
                    </div>
                </div>
            </div>

            <div class="container" @click="mainStore.gotoPage('settings-security')">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'shield-halved']" size="xl"/>
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('settings.security') }}
                    </div>
                </div>
            </div>

            <div class="container" @click="mainStore.gotoPage('settings-theme')">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'circle-half-stroke']" size="xl"/>
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('settings.theme') }}
                    </div>
                </div>
            </div>

            <div class="container" @click="mainStore.gotoPage('settings-help')">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'circle-question']" size="xl"/>
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('settings.help') }}
                    </div>
                </div>
            </div>
        </div>
        <!-- help menu -->
        <help v-show="mainStore.page == 'settings-help'"/>
        <!-- notifications menu -->
        <notifications v-show="mainStore.page == 'settings-notifications'" />
    </div>

    <popup />
</div>
</template>

<style scoped>
*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-track {
  background: white;        /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
  background-color: rgb(172, 169, 169);   /* color of the scroll thumb */
  
  border: 0px solid white;  /* creates padding around scroll thumb */
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

#menu {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
}

.content {
    background-color: v-bind(backgroundColor);
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
    margin-top: 10px;
    width: 100%;
    padding: 20px 20px 20px 10px;
    border-bottom: 1px solid rgb(226, 224, 224);
    

    display: flex;
    width: 100%;
    align-items: center;
}

.iconContainer {
    padding: 0px 30px 0px 30px;
    float: left;
    color: v-bind(iconColor);
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

.textContainerBig{
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