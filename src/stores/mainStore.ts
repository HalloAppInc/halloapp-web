import { defineStore } from 'pinia'
import hal from '../common/halogger'


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

        messageQueue: <any>[], 

        isLoggedIntoApp: false,
        isWaitingForUserToRegenKey: false,
        isConnectedToServer: false,
        haveAddedPublicKeyToServer: false,

        // isPublicKeyAuthenticated is inferred to be true once handshake complete,
        // but can be revoked independently afterwards
        isPublicKeyAuthenticated: false,

        haveInitialHandshakeCompleted: false,
        mobilePublicKeyBase64: '', 

        page: 'home',
        settingsPage: '',

        sounds: false,
        desktopAlerts: false,

        preferColorScheme: '',
    }),
    getters: {
    },
    actions: {
        login() {
            this.page = 'home'
            this.isLoggedIntoApp = true
        },
        logout() {
            this.privateKeyBase64 = ''
            this.mobilePublicKeyBase64 = ''
            this.isPublicKeyAuthenticated = false
            this.haveInitialHandshakeCompleted = false
            // todo: delete all saved data
            // todo: remove public key from server? (what if there's no connection)
            this.isLoggedIntoApp = false
        },
        gotoPage(page: string) {
            this.page = page
        },
        gotoSettingsPage(page: string) {
            this.settingsPage = page
        }
    },
})