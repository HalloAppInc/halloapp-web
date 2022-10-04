<script setup lang="ts">
    import { ref, toRefs } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'

    import { db } from '@/db'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import { web } from '@/proto/web.js'

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const { 
        primaryBlue: primaryBlueColor,
        text: textColor,
        line: lineColor,
        secondaryBorder: secondaryBorderColor,
    } = storeToRefs(colorStore) 

    const haveUnseenMainPosts = ref(false)

    init()

    async function init() {
        setupObserver()
    }

    async function setupObserver() {
        const observable = liveQuery (() => db.feed.where('seenState').equals(web.PostDisplayInfo.SeenState.UNSEEN).toArray())
        const avatarSubscription = observable.subscribe({
            next: result => {
                if (!result) { return }
                if (result.length == 0) {
                    haveUnseenMainPosts.value = false 
                    return 
                } else {
                    haveUnseenMainPosts.value = true
                }



            },
            error: error => console.error(error)
        })
    }


</script>

<template>

    <div id="wrapper">
        <div class="sideIconWrapper" >
            <div :class="['sideIcon', {selected: mainStore.page == 'home'}]" @click='mainStore.gotoPage("home")'>
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'house']" />
                </div>
                <div class="sideIconLabel">
                    {{ t('general.home') }} 
                </div>
                <!-- <div v-if="haveUnseenMainPosts" class="newHomeFeedIndicator"></div> -->
            </div>
        </div>

        <div class="sideIconWrapper">
            <div :class="['sideIcon', {selected: mainStore.page == 'groups'}]" @click='mainStore.gotoPage("groups")'>
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'user-group']" />
                </div>
                <div class="sideIconLabel">
                    {{ t('general.groups') }}
                </div>
            </div>
        </div>    

        <!-- <div class="sideIconWrapper">
            <div :class="['sideIcon', {selected: mainStore.page == 'chats'}]" @click='mainStore.gotoPage("chats")'>
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'message']" />
                </div>
                <div class="sideIconLabel">
                    {{ t('general.chats') }}
                </div>
            </div>
        </div> -->
        
        <div class="sideIconWrapper sideIconWrapperTop">
            <div :class="['sideIcon', {selected: mainStore.page == 'settings'}]" @click='mainStore.gotoPage("settings")'>
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'gear']" />
                </div>
                <div class="sideIconLabel">
                    {{ t('general.settings') }}
                </div>
            </div>
        </div>    

        <div class="sideIconWrapper sideIconWrapperBottom" @click="connStore.logout()">
            <div class="sideIcon">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'power-off']" />
                </div>
                <div class="sideIconLabel">
                    {{ t('general.logout') }}
                </div>
            </div>

            <div class="version">
                ver. {{ connStore.version }}
            </div>

        </div>

    </div>

</template>

<style scoped>

    #wrapper {
        width: 100%;
        height: 100%;
        color: white;

        padding: 70px 10px 10px 10px;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 20px;

        user-select: none;
    }

    .sideIconWrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        
        align-items: center;
    }
    .sideIconWrapperTop {
        flex: 1 0 auto;
        justify-self: flex-end;
    }

    .sideIconWrapperBottom {
        flex: 0 0 auto;
        justify-self: flex-end;
    }

    .selected {
        color: v-bind(primaryBlueColor);
    }

    .sideIcon {
        width: 100%;
        font-size: 14px;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 3px;
    }

    .icon {
        flex: 0 0 30%;
        justify-self: center;
        text-align: center;
    }

    .sideIcon:hover {
        /* color: v-bind(primaryBlue); */
        color: v-bind(primaryBlueColor);
        cursor: pointer;
    }

    .sideIconLabel {
        font-size: 11px;
        white-space: nowrap;
        justify-self: flex-start;
    }

    .newHomeFeedIndicator {
        
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: orange;
    
    }



    .version {
        margin-top: 15px;
        font-size: 10px;
        color: gray;
        
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
    }

    @media only screen and (max-width: 800px) {
        .sideIconLabel {
            display: none;
        }
    }

</style>
