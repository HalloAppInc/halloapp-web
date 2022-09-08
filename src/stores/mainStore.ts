import { defineStore } from 'pinia'
import hal from '../common/halogger'
import { db } from '../db'

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
        isDebug: false,
        devCORSWorkaroundUrlPrefix: '',

        isMobile: false,
        isIOS: false,
        isAndroid: false,
        isSafari: false, // mobile Safari and desktop Safari
        isFirefox: false,

        privateKeyBase64: '',
        publicKeyBase64: '',

        messageQueue: <any>[],
        pushnames: <any>{},
        pushnumbers: <any>{},

        isLoggedIntoApp: false,
        isConnectedToServer: false,
        haveAddedPublicKeyToServer: false,

        // isPublicKeyAuthenticated is inferred to be true once handshake complete,
        // but can be revoked independently afterwards
        isPublicKeyAuthenticated: false,

        haveInitialHandshakeCompleted: false,
        mobilePublicKeyBase64: '', 

        // cipherStateSend: <any>{},
        // cipherStateReceive: <any>{},

        userID: 0,

        showSidebar: true,
        animateSidebar: false,

        page: 'home',
        groupsPageGroup: <any>{},
        settingsPage: '',

        haveFetchedInitialMainFeed: false,
        mainFeedHeadPostID: '',
        mainFeedHeadPostTimestamp: 0,
        mainFeedTailPostID: '',
        mainFeedTailPostTimestamp: 0,
        mainFeedNextCursor: '',

        mobileNavlessPanel: '',
        scrollToTop: '',

        sounds: false,
        desktopAlerts: false,

        test: false, // test for upload&download, reload database

        preferColorScheme: '',

        loginUserID: '',
        chatID: '',

        inputArea: '',
    }),
    getters: {
    },
    actions: {
        loginMain() {
            if (!this.isLoggedIntoApp) {
                this.page = 'home'
                this.isLoggedIntoApp = true
                this.loginUserID = 'j_1H1YKQy74sDoCylPCEA'
            }
        },
        logoutMain() {
            this.privateKeyBase64 = ''
            this.mobilePublicKeyBase64 = ''
            this.isPublicKeyAuthenticated = false
            this.haveInitialHandshakeCompleted = false

            // for (let prop in this.cipherStateReceive) {
            //     delete this.cipherStateReceive[prop]
            // }       

            this.userID = 0

            this.haveFetchedInitialMainFeed = false
            this.mainFeedHeadPostID = ''
            this.mainFeedHeadPostTimestamp = 0
            this.mainFeedTailPostID = ''
            this.mainFeedTailPostTimestamp = 0
            this.mainFeedNextCursor = ''

            // deletes the entire db and re-opens it
            // todo: make sure all other dbs like chat is also deleted, test to see if delete/re-open is fast enough
            db.delete().then(() => db.open())
    
            // todo: remove public key from server? (what if there's no connection)

            this.isLoggedIntoApp = false
            this.loginUserID = ''
            
            /* manual reset instead of $reset() so we can preserve the states we want */
            this.page = 'home'
            this.settingsPage = ''
            // todo: might have to stop in-flight messages
            this.messageQueue.splice(0, this.messageQueue.length) // clear messages
            hal.log('mainStore/logged out')
        },
        gotoPage(page: string) {
            if (page == this.page) {
                this.scrollToTop = page
            } else { 
                this.page = page
            }

            /* wait 1s before activating so users flicking between tabs won't see the animation */
            if (page == 'groups') {
                setTimeout(this.activateSidebarAnimation, 1000)
            } else {
                this.showSidebar = true
                this.animateSidebar = false
            }
        },
        activateSidebarAnimation() {
            if (this.page == 'groups') {
                this.animateSidebar = true
            }
        },
        gotoSettingsPage(page: string) {
            this.settingsPage = page
        }
    },
})