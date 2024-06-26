<script setup lang="ts">
    import { ref, computed, watch } from 'vue'

    import hal from '../../common/halogger'

    import { useI18n } from 'vue-i18n'

    import { useColorStore } from '../../stores/colorStore'
    import { useMainStore } from '../../stores/mainStore'
    
    import { useHADatabase } from '../../composables/haDb'

    import Popup from './Popup.vue'
    import ChatSettings from './ChatSettings.vue'

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const colorStore = useColorStore()
    const mainStore = useMainStore()

    const { clearAllMessages, initMessageListAndMediaList, getContactByUserID } = useHADatabase()

    const showChatSettings = ref(false)
    const showBackgroundColorSetting = ref({ 'value': false})
    const showPopup = ref({ 'value': false, 'type': 'clear' })


    const chatName = ref()
    const chatInformation = ref()

    const chatID = computed(() => {
        return mainStore.chatID
    })

    watch(chatID,() => {
        getChatInfo()
    })

    const hoverColor = computed(() => {
        return colorStore.hover
    })
    const borderlineColor = computed(() => {
        return colorStore.borderline
    })
    const textColor = computed(() => {
        return colorStore.text
    })
    const headerColor = computed(() => {
        return colorStore.header
    })
    const iconColor = computed(() => {
        return colorStore.icon
    })
    const backgroundColor = computed(() => {
        return colorStore.background
    })

    function getChatInfo() {
        getContactByUserID(mainStore.chatID)
        .then(res => {
            // hal.log('ChatHeader/getChatInfo/', res)
            chatName.value = res?.userName
            chatInformation.value = 'Online'
        })
    }

    getChatInfo()

    function clearMessage() {
        clearAllMessages(mainStore.chatID)
    }

    function openPopup() {
        showPopup.value.value = true
    }

    function openBackgroundColorSetting() {
        showBackgroundColorSetting.value.value = true
    }
</script>

<template>

    <div class='chatHeader'>
        <div class='container'>

            <!-- show user profile photo and chat information -->
            <div class='avatarContainer'>
                <div class='avatar'></div>
            </div>

            <div class='content'>
                <div class='contentHeader'>
                    <div class='contentTitle'>
                        {{ chatName }}
                    </div>
                </div>
                <div class='contentBody'>
                    {{ chatInformation }}
                </div>
            </div>

            <!-- show chat menu -->
            <div class='verticalLine'> </div>
            <!-- <div class='iconContainer'>
                <div class='iconShadow'>
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" size='lg' />
                </div>
            </div> -->

            <div class='iconContainer' tabindex='0' @click='showChatSettings = !showChatSettings'
                @focusout='showChatSettings = false'>
                <div class='iconShadow' :class='{ showShadow: showChatSettings == true }'>
                    <font-awesome-icon :icon="['fas', 'angle-down']" size='lg' />
                </div>
            </div>

            <!-- TODO: delete, only for test -->
            <!-- reload all message and contacts -->
            <div v-if='mainStore.test' class='iconContainer' @click='initMessageListAndMediaList(true)'
                title="Reload database">
                <div class='iconShadow' :class='{ showShadow: showChatSettings == true }'>
                    <font-awesome-icon :icon="['fas', 'hammer']" size='lg' />
                </div>
            </div>
            
        </div>
    </div>

    <!-- chat settings menu -->
    <div class='chatSettings' v-if='showChatSettings'>
        <div class='menu'>

            <!-- change background color -->
            <div class='menuContainer' @mousedown='openBackgroundColorSetting'>
                <div class='textContainer'>
                    <div class='contentTextBody'>
                        {{ t('chatSettings.changeBackgroundColor') }}
                    </div>
                </div>
            </div>

            <!-- clear messages -->
            <div class='menuContainer' @mousedown="openPopup">
                <div class='textContainer textContainerlastElement'>
                    <div class='contentTextBody'>
                        {{ t('chatSettings.clearMessgae') }}
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- clear all messages popup -->
    <Popup 
        @confirmOk='clearMessage'
        :showPopup='showPopup' />

    <!-- background color setting page-->
    <ChatSettings :showBackgroundColorSetting='showBackgroundColorSetting'/>

</template>

<style scoped>
    .chatHeader {
        overflow-y: auto;
        overflow-x: hidden;
        background-color: v-bind(headerColor);
        height: 100%;
    }

    .container {
        display: flex;
        flex-direction: horizontal;
        padding: 0px;
    }

    .avatarContainer {
        flex: 0 0 70px;
        padding: 5px 0px 5px 20px;
    }

    .avatar {
        width: 40px;
        height: 40px;

        background-color: lightgray;
        border-radius: 50%;
    }

    .content {
        width: 100%;
        padding: 0px 10px;

        display: flex;
        width: 100%;
        flex-direction: column;

        user-select: none;

        overflow: hidden;
    }

    .contentHeader {
        margin-top: 8px;
        display: flex;

        justify-content: flex-start;
    }

    .contentTitle {
        color: v-bind(textColor);
        font-weight: 600;
        flex: 1 1 auto;
        min-width: 0;
        text-overflow: ellipsis;
        white-space: nowrap;

        user-select: none;

        overflow: hidden;
    }

    .contentBody {
        margin-top: 2px;
        margin-bottom: 3px;

        color: v-bind(textColor);
        font-size: small;
    }

    .iconContainer {
        padding: 5px 20px 5px 0px;
        color: v-bind(iconColor);
    }

    .iconContainer:hover {
        cursor: pointer;
    }

    .iconShadow {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 50%;
    }

    .iconShadow:hover {
        background-color: v-bind(hoverColor);
    }

    .showShadow {
        background-color: v-bind(hoverColor);
    }

    .verticalLine {
        border-right: 1px solid rgb(200, 200, 200);
        height: 30px;
        margin: 10px 30px;
    }

    .chatSettings {
        float: right;
    }

    .menu {
        z-index: 4;
        width: 300px;
        padding: 0px;
        position: fixed;
        right: 10px;
        background-color: v-bind(backgroundColor);
        border-radius: 5px;
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
    }

    .menuContainer {
        display: flex;
        flex-direction: horizontal;
        align-items: center;
    }

    .menuContainer:hover {
        background-color: v-bind(hoverColor);
        cursor: pointer;
    }

    .textContainer {
        color: v-bind(textColor);
        width: 100%;
        height: 2em;
        padding: 20px;
        border-bottom: 1px solid v-bind(borderlineColor);

        display: flex;
        align-items: center;
    }

    .textContainerlastElement {
        border-bottom: 0px;
    }

    .contentTextBody {
        font-size: medium;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>
