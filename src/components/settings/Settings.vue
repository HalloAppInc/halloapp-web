<script setup lang="ts">
    import { ref, computed } from 'vue'

    import { useI18n } from 'vue-i18n'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useIconStore } from '@/stores/iconStore'
    import { useColorStore } from '@/stores/colorStore'

    import Popup from '@/components/chats/Popup.vue'

    import SettingsHeader from '@/components/settings/SettingsHeader.vue'
    import Avatar from '@/components/media/Avatar.vue'

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const iconStore = useIconStore()
    const colorStore = useColorStore()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const showPopup = ref({'value': false, 'type': 'theme', 'mode': ref(mainStore.preferColorScheme)})

    const hoverColor = computed(() => {
        return colorStore.hover
    })
    const textColor = computed(() => {
        return colorStore.text
    })
    const backgroundColor = computed(() => {
        return colorStore.background
    })
    const secondaryTextColor = computed(() => {
        return colorStore.secondaryText
    })
    const iconColor = computed(() => {
        return colorStore.icon
    })
    const borderlineColor = computed(() => {
        return colorStore.borderline
    })
    const headerColor = computed(() => {
        return colorStore.header
    })

    function gotoThemeMenu() {
        showPopup.value.value = true
        showPopup.value.type = 'theme'
        showPopup.value.mode = mainStore.preferColorScheme
    }

    function changePreferColorScheme(mode: string) {
        iconStore.changePreferColorSchema(mode)
        colorStore.changePreferColorSchema(mode)
    }
</script>

<template>
    <transition name='main'>
        <div v-if="mainStore.settingsPage == ''">
            <div class='settingsHeader'>

                <SettingsHeader></SettingsHeader>

            </div>

            <div class='content'>
                <div class='menu'>
                    <!-- user profile -->
                    <div class="container">
                        <div class="profileContent">
                            <div class="avatarContainer">
                                <Avatar :userID="mainStore.userID" :width="80"></Avatar>
                            </div>
                            <div class="headerContent">
                                <div class="contentTitle">
                                    {{ mainStore.pushnames[mainStore.userID] }}
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

                    <!-- <div class="container" @click="mainStore.gotoSettingsPage('privacy')">
                        <div class="iconContainer">
                            <font-awesome-icon :icon="['fas', 'lock']" size="lg" />
                        </div>
                        <div class="textContainer">
                            <div class="contentTextBody">
                                {{ t('settings.privacy') }}
                            </div>
                        </div>
                    </div> -->

                    <!-- <div class="container" @click="mainStore.gotoSettingsPage('security')">
                        <div class="iconContainer">
                            <font-awesome-icon :icon="['fas', 'shield-halved']" size="lg" />
                        </div>
                        <div class="textContainer">
                            <div class="contentTextBody">
                                {{ t('settings.security') }}
                            </div>
                        </div>
                    </div> -->

                    <div class="container" @click='gotoThemeMenu'>
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

                    <div class="container" @click="connStore.logout()">
                        <div class="iconContainer">
                            <font-awesome-icon :icon="['fas', 'power-off']" size="lg" />
                        </div>
                        <div class="textContainer">
                            <div class="contentTextBody">
                                {{ t('general.logout') }}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </transition>

    <!-- change color scheme popup -->
    <Popup :showPopup='showPopup' @changePreferColorScheme='changePreferColorScheme'/>

</template>

<style scoped>
    .menu {
        height: 100%;
    }

    .settingsHeader {
        flex: 0 0 50px;
        height: 50px;
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
        border-bottom: 1px solid v-bind(borderlineColor);


        display: flex;
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

    *::-webkit-scrollbar {
        width: 5px;
    }

    *::-webkit-scrollbar-track {
        background: white;      /* color of the tracking area */
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgb(172, 169, 169);      /* color of the scroll thumb */

        border: 0px solid white;        /* creates padding around scroll thumb */
    }

    /* animation in from left to right, out from right to left */
    .main-enter-active {
        transition: all 0.15s ease-in 0.15s;
    }

    .main-leave-active {
        transition: all 0.15s ease-out;
    }

    .main-enter-from {
        transform: translateX(-200px);
        opacity: 0;
    }

    .main-leave-from {
        opacity: 1;
    }

    .main-leave-to {
        transform: translateX(-200px);
        opacity: 0;
    }

</style>