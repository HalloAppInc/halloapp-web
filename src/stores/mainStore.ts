import { faTurkishLira } from '@fortawesome/free-solid-svg-icons'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {

    persist: {
        key: 'store-main',
        storage: window.localStorage,
        beforeRestore: context => {
            // console.log('stores/main/before hydration...')
        },
        afterRestore: context => {
            // console.log('stores/main/after hydration...')
        },
    },

    state: () => ({
        isConnected: false,
        counter: 0,

        // for color schema
        preferColorScheme: 'light',

        privateKeyBase64: '',
        publicKeyBase64: '',

        connectionState: ''
    }),

    getters: {
        // getters receive the state as first parameter
        doubleCount: (state) => state.counter * 2,
        // use getters in other getters
        doubleCountPlusOne(): number {
        return this.doubleCount + 1
        },
    },

    actions: {
        add() {
            this.counter++
        },
        reset() {
            this.counter = 0
        },
        login() {
            this.isConnected = true
        },    
        logout() {
            this.isConnected = false
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