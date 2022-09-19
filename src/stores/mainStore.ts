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
        devCORSWorkaroundUrlPrefix: '',

        isMobile: false,
        isIOS: false,
        isAndroid: false,
        isSafari: false, // mobile Safari and desktop Safari
        isFirefox: false,

        privateKeyBase64: '',
        publicKeyBase64: '',

        isLoggedIntoApp: false,
        isConnectedToServer: false,
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

        showSidebar: true,
        animateSidebar: false,

        page: 'home',
        groupsPageGroupID: '',
        settingsPage: '',
        scrollToTop: '',
        mobileNavlessPanel: '',

        mainFeedHeadPostID: '',
        mainFeedHeadPostTimestamp: 0,
        mainFeedTailPostID: '',
        mainFeedTailPostTimestamp: 0,
        mainFeedNextCursor: '',

        groupFeedCursors: <any>{},
        commentCursors: <any>{}, // keys are postIDs

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

                hal.log('mainStore/logged out')
                db.open() 
            })
        },
        gotoPage(page: string) {
            if (page == this.page) {
                if (page == 'groups') {
                    this.scrollToTop = this.groupsPageGroupID
                } else {
                    this.scrollToTop = page
                }
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
        gotoGroup(groupID?: string) {
            if (!groupID) return
            this.selectGroup(groupID)
            this.gotoPage('groups')
            
        },
        selectGroup(groupID?: string) {
            if (!groupID) return
            this.groupsPageGroupID = groupID
        },
        gotoSettingsPage(page: string) {
            this.settingsPage = page
        }
    },
})
