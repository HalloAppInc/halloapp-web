import { defineStore } from 'pinia'

import hal from '@/common/halogger'
import { db } from '@/db'
import { useConnStore } from '@/stores/connStore'

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
        isSafari: false, // mobile Safari and desktop Safari
        isFirefox: false,

        privateKeyBase64: '',
        publicKeyBase64: '',

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
        animateSidebar: false,

        page: 'home',
        groupsPageGroupID: '',
        settingsPage: '',
        scrollToTop: '',
        mobileNavlessPanel: '',

        showGroupsSidebar: true,
        showGroupsCommentsPanel: false,

        showSettings: false,

        mainFeedHeadPostID: '',
        mainFeedHeadPostTimestamp: 0,
        mainFeedTailPostID: '',
        mainFeedTailPostTimestamp: 0,
        mainFeedNextCursor: '',

        groupFeedCursors: <any>{},
        commentCursors: <any>{}, // keys are postIDs

        sounds: true,
        desktopAlerts: true,

        test: false, // test for upload&download, reload database

        preferColorScheme: '',

        loginUserID: '',
        chatID: '',

        inputArea: '',
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
        loginMain() {
            if (!this.isLoggedIntoApp) {
                this.page = 'home'
                this.isLoggedIntoApp = true
                this.loginUserID = 'j_1H1YKQy74sDoCylPCEA'
            }
        },
        logoutMain() {
            // deletes the entire db and re-opens it
            // todo: make sure all other dbs like chat is also deleted, test to see if delete/re-open is fast enough
            db.delete().then(() => {

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
    
                // todo: remove public key from server? (what if there's no connection)
    
                this.isLoggedIntoApp = false
                this.loginUserID = ''
                
                this.page = 'home'
                this.groupsPageGroupID = ''
                this.settingsPage = ''
                this.scrollToTop = ''

                this.showSettings = false

                this.sounds = true,
                this.desktopAlerts = true,

                // todo: might have to stop in-flight messages

                this.messageQueue.splice(0, this.messageQueue.length) // clear messages
    
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
                db.open() 
            })
        }        
    },
})
