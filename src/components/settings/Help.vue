<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useI18n } from 'vue-i18n'
    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'
    import { useTimeformatter } from '@/composables/timeformatter'
        
    const { t, locale } = useI18n({ inheritLocale: true, useScope: 'global' })

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    const { primaryBlue: primaryBlueColor,
            primaryLightgray: primaryLightgrayColor,
            background: backgroundColor, 
            secondaryBg: secondaryBgColor,
            header: headerColor,
            text: textColor,
            icon: iconColor,
            hover: hoverColor,
            borderline: borderlineColor,
            timestamp: timestampColor,
    } = storeToRefs(colorStore)

    const { formatTimeEmailLogs } = useTimeformatter()

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
    const language = setLanguage(locale.value as string)
    const helpLink = ref('https://www.halloapp.com/' + language + 'help/')
    const termsLink = ref('https://www.halloapp.com/' + language + 'terms/')
    const privacyPolicyLink = ref('https://www.halloapp.com/' + language + 'privacy/')

    function gotoHelp() {
        (window as any).open(helpLink.value)
    }

    function gotoTerms() {
        (window as any).open(termsLink.value)
    }

    function gotoPrivacyPolicy() {
        (window as any).open(privacyPolicyLink.value)
    }

    function openEmailClientForFeedback() {
        let browser = ''
        if (mainStore.isChrome) { browser = 'Chrome'}
        else if (mainStore.isSafari) { browser = 'Safari'}
        else if (mainStore.isFirefox) { browser = 'Firefox'}
        
        const email = 'tony@halloapp.com'
        const subject = 'Web Client Feedback/Issue ' + formatTimeEmailLogs(locale.value as string)
        let body = '\n\n\n\nPlease leave feedback or a description of the issue in the space above.\n\n'
        body += 'Ver: ' + connStore.version + ', Browser: ' + browser + '\n\n'
        body += 'Logs:\n'

        for (let i = 0; i < mainStore.savedLogs.length; i++) {
            body += mainStore.savedLogs[i] + '\n'
        }
        body += '\n\n'

        body = encodeURIComponent(body)

        document.location =
        "mailto:" + email + "?Content-type=text/html" + "&subject=" + subject + "&body=" + body
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
                            <font-awesome-icon :icon="['fas', 'lock']" size='lg' />
                        </div>
                        <div class='textContainer'>
                            <div class='contentTextBody'>
                                {{ t('help.privacyPolicy') }}
                            </div>
                        </div>
                    </div>

                    <div class="container" style="margin-top: 30px;" @click="openEmailClientForFeedback">
                        <div class="iconContainer">
                            <font-awesome-icon :icon="['fas', 'envelope']" size='lg' />
                        </div>
                        <div class='textContainer'>
                            <div class='contentTextBody'>
                                {{ t('help.shareFeedbackAndLogs') }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    </transition>

</template>

<style scoped>
    #menu {
        background-color: v-bind(primaryLightgrayColor);
        height: 100%;
    }

    #header {
        flex: 0 0 50px;
        background-color: v-bind(primaryLightgrayColor);
        padding: 10px;
    }

    .content {
        background-color: v-bind(primaryLightgrayColor);
    }

    .contentMenuTitle {
        display: flex;
        flex-direction: row;
        background-color: v-bind(primaryLightgrayColor);
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
        border-bottom: 1px solid v-bind(borderlineColor);


        display: flex;
        align-items: center;
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

</style>