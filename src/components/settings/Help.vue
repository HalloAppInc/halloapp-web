<script setup lang="ts">
import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

import { useI18n } from 'vue-i18n'

import { ref, computed } from 'vue'

const colorStore = useColorStore()
const mainStore = useMainStore()

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const helpMenu = ref<HTMLDivElement>()

// find the offset to the top
const offsetTop = computed(() => {
    let offset = helpMenu.value?.offsetTop
    if (offset != undefined) {
        return (-1 * offset)
    }
})

function setLanguage(language: string) {
    if (language != 'en' && language != 'id') {
        return language + '/'
    }
    return ''
}

// get language settings from locale
const language = setLanguage(locale.value)
const helpLink = ref('https://www.halloapp.com/' + language + 'help/')
const termsLink = ref('https://www.halloapp.com/' + language + 'terms/')
const privacyPolicyLink = ref('https://www.halloapp.com/' + language + 'privacy/')



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

function gotoHelp() {
    (<any>window).open(helpLink.value)
}

function gotoTerms() {
    (<any>window).open(termsLink.value)
}

function gotoPrivacyPolicy() {
    (<any>window).open(privacyPolicyLink.value)
}

</script>

<template>
    <transition name='help'>
        <div v-if="mainStore.settingsPage == 'help'" ref='helpMenu'>
            <div id='header'>
                <div class='contentMenuTitle'>
                    <div class='iconContainer' @click="mainStore.gotoSettingsPage('')">
                        <font-awesome-icon :icon="['fas', 'arrow-left']" size='lg' />
                    </div>
                    <div class='textContainerBig'>
                        <div class='contentTextBodyBig'>
                            {{ t('settings.help') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class='content'>
                <div id='menu'>
                    <!-- Help Center -->
                    <div class='container'>
                        <div class='iconContainer'>
                            <font-awesome-icon :icon="['fas', 'circle-question']" size='lg' />
                        </div>
                        <div class='textContainer' @click='gotoHelp()'>
                            <div class='contentTextBody'>
                                {{ t('help.helpCenter') }}
                            </div>
                        </div>
                    </div>
                    <!-- Contact Us -->
                    <!-- <div class='container' @click=''>
                        <div class='iconContainer'>
                            <font-awesome-icon :icon="['fas', 'users']" size='lg' />
                        </div>
                        <div class='textContainer'>
                            <div class='contentTextBody'>
                                {{ t('help.contactUs') }}
                            </div>
                        </div>
                    </div> -->
                    <!-- Terms and Privacy Policy -->
                    <div class='container' @click='gotoTerms()'>
                        <div class='iconContainer'>
                            <font-awesome-icon :icon="['fas', 'file-lines']" size='lg' />
                        </div>
                        <div class='textContainer'>
                            <div class='contentTextBody'>
                                {{ t('help.terms') }}
                            </div>
                        </div>
                    </div>
                    <!-- privacy -->
                    <div class='container' @click='gotoPrivacyPolicy()'>
                        <div class="iconContainer">
                            <font-awesome-icon :icon="['fas', 'file-lines']" size='lg' />
                        </div>
                        <div class='textContainer'>
                            <div class='contentTextBody'>
                                {{ t('help.privacyPolicy') }}
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
.help-enter-active {
    transition: all 0.15s ease-in 0.15s;
}

.help-leave-active {
    transition: all 0.15s ease-out;
}

.help-enter-from {
    transform: translateX(200px);
    opacity: 0;
}

.help-leave-from {
    transform: translateY(v-bind(offsetTop + 'px'));
    opacity: 1;
}

.help-leave-to {
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
    background-color: rgb(172, 169, 169);   /* color of the scroll thumb */
    
    border: 0px solid white;    /* creates padding around scroll thumb */
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