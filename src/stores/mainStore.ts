import { defineStore } from 'pinia'
import { Dexie } from 'dexie'

import { useConnStore } from '@/stores/connStore'
import { db } from '@/db'
import hal from '@/common/halogger'

export const useMainStore = defineStore('main', {
    persist: {
        key: 'store-main',
        storage: window.localStorage,
        beforeRestore: context => {
            // hal.log('stores/main/before hydration...')
        },
        afterRestore: context => {
            // hal.log('stores/main/after hydration...')
        },
    },
    state: () => ({
        devCORSWorkaroundUrlPrefix: '',

        isMobile: false,
        isIOS: false,
        isAndroid: false,
        isChrome: false,
        isSafari: false, // mobile Safari and desktop Safari
        isFirefox: false,

        privateKeyBase64: '',
        publicKeyBase64: '',

        allowDbTransactions: false,

        isLoggedIntoApp: false,
        haveAddedPublicKeyToServer: false,

        // isPublicKeyAuthenticated is inferred to be true once handshake complete,
        // but can be revoked independently afterwards
        isPublicKeyAuthenticated: false,

        haveInitialHandshakeCompleted: false,
        mobilePublicKeyBase64: '', 

        messageQueue: <any>[],
    
        userID: 0,
        pushnames: <any>{},
        pushnumbers: <any>{},
        groupnames: <any>{},

        shownNotifications: <any>{},
        shownNotificationsArr: [] as string[],      // used mainly for fast clean up of shownNotifications

        showSidebar: true,

        page: 'home',
        
        scrollToTop: '',

        /* page: home, main feed */
        showNewPostsDotIndicator: false,

        /* page: groups */
        groupsPageGroupID: '',
        showGroupsSidebar: true,
        showGroupsCommentsPanel: false,
        showGroupsCommentsPostID: '',

        isGroupsListCompleted: false,
        isPrivacyListCompleted: false,

        /* page: settings */
        showSettings: false,
        settingsPage: '',
        sounds: true,
        desktopAlerts: true,
        preferColorScheme: '',
        
        /* cursors */
        mainFeedHeadPostID: '',
        mainFeedHeadPostTimestamp: 0,
        mainFeedTailPostID: '',
        mainFeedTailPostTimestamp: 0,
        mainFeedNextCursor: '',

        groupFeedCursors: <any>{},
        commentCursors: <any>{}, // keys are postIDs

        isMomentsLocked: true,

        test: false, // test for upload&download, reload database

        loginUserID: '',
        chatID: '',

        inputArea: '',

        savedLogs: [] as string[],
    }),
    getters: {
    },
    actions: {
        /* first user interactions include 'clicking' to go to any page, opening comments, opening fullscreener */
        triggerFirstInteraction() {
            const connStore = useConnStore()
            if (!connStore.isUserFirstClickCompleted) {
                hal.log('mainStore/first user interaction recorded')
                connStore.isUserFirstClickCompleted = true 
            }
        },
        gotoPage(page: string) {
            hal.log('mainStore/gotoPage: ' + page)
            this.triggerFirstInteraction()
            if (page == this.page) {
                if (page == 'groups') {
                    this.scrollToTop = this.groupsPageGroupID
                } else {
                    this.scrollToTop = page
                }
            } else { 
                this.page = page
            }
            
            this.showSettings = false
        },
        gotoGroup(groupID?: string) {
            if (!groupID) return
            this.selectGroup(groupID)
            this.gotoPage('groups')
        },
        selectGroup(groupID?: string) {
            hal.log('mainStore/selectGroup: ' + groupID)
            if (!groupID) return
            this.groupsPageGroupID = groupID
        },
        toggleSettings() {
            this.triggerFirstInteraction()

            this.showSettings = !this.showSettings
        },
        gotoSettingsPage(page: string) {
            this.settingsPage = page
        },
        async loginMain() {
            if (!this.isLoggedIntoApp) {
                this.allowDbTransactions = true
                this.page = 'home'
                this.isLoggedIntoApp = true
                this.loginUserID = 'j_1H1YKQy74sDoCylPCEA'
            }
        },
        async logoutMain() {
            // todo: make sure all other dbs like chat is also deleted, test to see if delete/re-open is fast enough

            // todo: might have to stop in-flight messages also
            this.messageQueue.splice(0, this.messageQueue.length) // clear messages
            this.allowDbTransactions = false

            // give it one second for all the in-flight transactions to stop before deleting the database
            setTimeout(async () => {

                // deletes the entire db and re-opens it
                await db.delete()

                /* manual reset instead of $reset() so we can preserve the states we want */
                this.privateKeyBase64 = ''
                this.mobilePublicKeyBase64 = ''
                this.isPublicKeyAuthenticated = false
                this.haveInitialHandshakeCompleted = false

                this.userID = 0

                this.mainFeedHeadPostID = ''
                this.mainFeedHeadPostTimestamp = 0
                this.mainFeedTailPostID = ''
                this.mainFeedTailPostTimestamp = 0
                this.mainFeedNextCursor = ''

                this.isLoggedIntoApp = false
                this.loginUserID = '' // deprecated, test and then remove
                
                this.page = 'home'
                this.groupsPageGroupID = ''
                this.settingsPage = ''
                this.scrollToTop = ''

                this.showNewPostsDotIndicator = false

                this.showGroupsSidebar = true
                this.showGroupsCommentsPanel = false
                this.showGroupsCommentsPostID = ''

                this.isGroupsListCompleted = false
                this.isPrivacyListCompleted = false

                this.showSettings = false

                this.sounds = true
                this.desktopAlerts = true

                this.isMomentsLocked = true

                for (const prop of Object.getOwnPropertyNames(this.pushnames)) {
                    delete this.pushnames[prop]
                }
                for (const prop of Object.getOwnPropertyNames(this.pushnumbers)) {
                    delete this.pushnumbers[prop]
                }
                for (const prop of Object.getOwnPropertyNames(this.groupnames)) {
                    delete this.groupnames[prop]
                }
                for (const prop of Object.getOwnPropertyNames(this.groupFeedCursors)) {
                    delete this.groupFeedCursors[prop]
                }
                for (const prop of Object.getOwnPropertyNames(this.commentCursors)) {
                    delete this.commentCursors[prop]
                }
                for (const prop of Object.getOwnPropertyNames(this.shownNotifications)) {
                    delete this.shownNotifications[prop]
                }
                this.shownNotificationsArr.splice(0, this.shownNotificationsArr.length)

                hal.log('mainStore/logged out')
                await db.open() // db needs to be manually re-opened after a delete

            }, 500)

        }        
    },
})
