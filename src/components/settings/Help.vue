<script setup lang="ts">
import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

import { useI18n } from 'vue-i18n'

import { ref, computed } from 'vue'

const colorStore = useColorStore()
const mainStore = useMainStore()

const language = ''

const helpLink = ref('https://www.halloapp.com/'+language+'help/')
const termsLink = ref('https://www.halloapp.com/'+language+'terms/')
const privacyPolicyLink = ref('https://www.halloapp.com/'+language+'privacy/')

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const backgroundColor = computed(() => {
    return colorStore.mainBackground
})

const textColor = computed(() => {
    return colorStore.text
})

const hoverColor = computed(() => {
    return colorStore.hover
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
    <div class="content">
            <!-- Help Center -->
            <div class="container">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'circle-question']" />
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
                    <font-awesome-icon :icon="['fas', 'users']" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('help.contactUs') }}
                    </div>
                </div>
            </div>
            <!-- Licenses -->
            <div class="container" @click="">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'file-lines']" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('help.licenses') }}
                    </div>
                </div>
            </div>
            <!-- Terms and Privacy Policy -->
            <div class="container" @click="gotoTerms()">
                <div class="iconContainer">
                    <font-awesome-icon :icon="['fas', 'file-lines']" />
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
                    <font-awesome-icon :icon="['fas', 'file-lines']" />
                </div>
                <div class="textContainer">
                    <div class="contentTextBody">
                        {{ t('help.privacyPolicy') }}
                    </div>
                </div>
            </div>
    </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

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

.content {
    background-color: v-bind(backgroundColor);
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
    border-bottom: 1px solid rgb(226, 224, 224);
    

    display: flex;
    width: 100%;
    align-items: center;
}

</style>