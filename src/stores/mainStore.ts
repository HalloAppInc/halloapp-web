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
        isMobile: false,
        isIOS: false,
        isAndroid: false,
        isSafari: false, // mobile Safari and desktop Safari
        isFirefox: false,

        privateKeyBase64: '',
        publicKeyBase64: '',

        connectionState: '',

        isLoggedIntoApp: false,
        isConnectedToServer: false,
        isHandshakeCompleted: false,
        haveMobilePublicKey: '',

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