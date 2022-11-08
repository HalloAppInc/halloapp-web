<script setup lang="ts">
    import { Ref, ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'

    import { db } from '@/db'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import { web } from '@/proto/web.js'

    import notificationSound from '@/assets/send.mp3'

    import { Howl } from 'howler'

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

    const haveUnseenPosts = ref(false)
    const numUnseenMainPosts = ref(0)
    const unseenGroupsMap: Ref<any> = ref({})
    const numUnseenGroups = ref(0)

    init()

    async function init() {
        setupObserver()
    }

    async function setupObserver() {
        const observable = liveQuery (() => db.post.where('seenState').equals(web.PostDisplayInfo.SeenState.UNSEEN).toArray())
        const subscription = observable.subscribe({
            next: result => {
                if (!result) { return }
                
                haveUnseenPosts.value = false
                numUnseenMainPosts.value = 0
                unseenGroupsMap.value = {}
                numUnseenGroups.value = 0

                for (let i = 0; i < result.length; i++) {
                    const item = result[i]

                    if (item.groupID) {
                        if (!unseenGroupsMap.value[item.groupID]) {
                            unseenGroupsMap.value[item.groupID] = 1
                        } else {
                            unseenGroupsMap.value[item.groupID]++
                        }
                    } else {
                        numUnseenMainPosts.value++
                    }

                    processNotification(item)
                }

                numUnseenGroups.value = Object.keys(unseenGroupsMap.value).length

                if (numUnseenMainPosts.value || numUnseenGroups.value) {
                    /* 
                     * this flag might need to be changed to work more like iOS where it's false any time the user
                     * goes to the top of the main feed, even when there are still unseen posts
                     */
                    haveUnseenPosts.value = true
                } else {
                    mainStore.showNewPostsDotIndicator = false
                }


            },
            error: error => console.error(error)
        })
    }

    async function processNotification(item: any) {
        if (Notification.permission === 'granted') {

            const id = item.postID // todo: there might be other notifications beside posts

            if (id in mainStore.shownNotifications) { return }

            /* 
                record notification even if it's not shown due to visiblity, 
                because that would mean the user have the client opened and actually
                have seen the post
            */
            mainStore.shownNotifications[id] = {'seen': 'yes'}
            mainStore.shownNotificationsArr.push(id)

            /* clean up */
            if (mainStore.shownNotificationsArr.length >= 2000) {
                for (let i = 0; i <= 1000; i++) {
                    const key = mainStore.shownNotificationsArr.pop()
                    if (!key) continue
                    delete mainStore.shownNotifications[key]
                }
            }

            /* do not notify if user have the tab open */
            if (document.visibilityState === 'visible') { return }

            if (connStore.isUserFirstClickCompleted && mainStore.sounds) {
      
                let sound = new Howl({
                    src: [notificationSound]
                })

                sound.play()
            }

            if (mainStore.desktopAlerts) {

                let notification = new Notification(
                    'HalloApp', {
                        badge: 'https://web.halloapp.com/assets/images/favicon.ico',
                        body: 'New post!',
                        icon: 'https://web.halloapp.com/assets/images/favicon.ico',
                        // image: 'https://web.halloapp.com/assets/images/test.jpg',
                    }
                )
                notification.onclick = function() {
                    window.focus()
                }
            }

        }

        // ask the user for permission
        else if (Notification.permission !== 'denied') {
            
            Notification.requestPermission().then(function (permission) {
                // user accepts
                if (permission === 'granted') {
            
                    let notification = new Notification(
                        'HalloApp', {
                            badge: 'https://web.halloapp.com/assets/images/favicon.ico',
                            body: 'New post!',
                            icon: 'https://web.halloapp.com/assets/images/favicon.ico',
                            // image: 'https://web.halloapp.com/assets/images/test.jpg',
                        }
                    )

                }
            })
        }

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
                <div v-if="mainStore.showNewPostsDotIndicator" class="newHomeFeedIndicator"></div>
            </div>
        </div>

        <div class="sideIconWrapper">
            <div :class="['sideIcon', {selected: mainStore.page == 'groups'}]" @click='mainStore.gotoPage("groups")'>
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'user-group']" />
                    <div v-if="numUnseenGroups" class="unreadGroup">{{ numUnseenGroups }}</div>
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
        
        <div class="sideIconWrapper sideIconWrapperTop" style="margin-top: 15px;">
            <div :class="['sideIcon', {}]" @click='mainStore.toggleSettings()'>
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
        position: relative;

        flex: 0 0 30%;
        justify-self: center;
        text-align: center;
    }

    .unreadGroup {
        position: absolute;
        top: -8px;
        right: -5px;

        
        padding: 0px 3px 0px 3px;
  
        text-align: center;
       
        border-radius: 99999px;
        background-color:orangered;
        border:none;
        color:white;
        font-size: 11px;
        

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
