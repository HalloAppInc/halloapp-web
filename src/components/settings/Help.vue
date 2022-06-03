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
    var offset = helpMenu.value?.offsetTop
    if (offset != undefined)
        return -1 * offset + 50
})

function setLanguage(language: string) {
    if (language === 'en') {
        return ''
    }
    return language + '/'
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
    <transition>
        <div v-if="mainStore.settingsPage == 'help'" id='menu' ref='helpMenu'>
            <!-- Help Center -->
            <div class="container">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'circle-question']" size="xl" />
                </div>
                <div class="textContainer" @click="gotoHelp()">
                    <div class="contentTextBody">
                        {{ t('help.helpCenter') }}
                    </div>
                </div>
            </div>
            <!-- Contact Us -->
            <div class="container" @click="">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'users']" size="xl" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('help.contactUs') }}
                    </div>
                </div>
            </div>
            <!-- Terms and Privacy Policy -->
            <div class="container" @click="gotoTerms()">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'file-lines']" size="xl" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('help.terms') }}
                    </div>
                </div>
            </div>
            <!-- privacy -->
            <div class="container" @click="gotoPrivacyPolicy()">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'file-lines']" size="xl" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('help.privacyPolicy') }}
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
    /* get the height? */
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
    padding: 0px 30px 0px 30px;
    float: left;
    color: v-bind(iconColor);
}

.iconContainer:hover {
    cursor: pointer;
}

.contentTextBody {
    font-size: larger;

    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.textContainer {
    color: v-bind(textColor);
    margin-top: 10px;
    width: 100%;
    padding: 20px 20px 20px 10px;
    border-bottom: 1px solid v-bind(lineColor);


    display: flex;
    width: 100%;
    align-items: center;
}
</style>