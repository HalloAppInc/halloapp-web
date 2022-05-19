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
        }
    },

})