import { faTurkishLira } from '@fortawesome/free-solid-svg-icons'
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

        // for color schema
        preferColorScheme: 'light',

        privateKeyBase64: '',
        publicKeyBase64: '',

        connectionState: '',

        isLoggedIntoApp: false,
        isConnectedToServer: false,
        isHandshakeCompleted: false,
        haveMobilePublicKey: '',

        page: 'home',
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
        changePreferColorSchema(mode: string) {
            // auto mode
            if (mode == "auto") {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.preferColorScheme = "auto-dark";
                }
                else {
                    this.preferColorScheme = "auto-light";
                }
            }
            // change color manually
            else {
                this.preferColorScheme = mode;
            }
        }
    },
})