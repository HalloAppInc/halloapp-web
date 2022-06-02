import { defineStore } from 'pinia';

import colors from '../common/colors';

export const useColorStore = defineStore('color', {
    persist: {
        key: 'store-color',
        storage: window.localStorage,
        beforeRestore: context => {
        },
        afterRestore: context => {
        },
    },
    state: () => ({
        // for color schema
        preferColorScheme: 'light',
        createListener: false,

        // color
        mainBackground: colors.backgroundLight,
        header: colors.headerLight,
        hover: colors.hoverLight,
        text: colors.textLight,
        borderline: colors.borderlineLight,
        secondaryText: colors.secondaryTextLight,
        icon: colors.iconLight,
    }),
    getters: {
    },
    actions: {

        computeColors(mode: string) {
            this.mainBackground = colors['background' + mode]
            this.header = colors['header' + mode]
            this.hover = colors['hover' + mode]
            this.text = colors['text' + mode]
            this.secondaryText = colors['secondaryText' + mode]
            this.borderline = colors['borderline' + mode]
            this.icon = colors['icon' + mode]
        },

        changePreferColorSchema(mode: string) {
            // auto mode
            if (mode == 'auto') {
                this.preferColorScheme = 'auto'
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.computeColors('Dark')
                }
                else {
                    this.computeColors('Light')
                }
                // add listener to the color scheme of the browser
                if (!this.createListener) {
                    this.createListener = true // only add one listener
                    window.matchMedia('(prefers-color-scheme: dark)')
                        .addEventListener('change', event => {
                            if (event.matches) {
                                this.computeColors('Dark')
                            } else {
                                this.computeColors('Light')
                            }
                        })
                }
            }
            // change color manually
            else if (mode == 'dark') {
                this.preferColorScheme = 'dark'
                this.computeColors('Dark')
            }
            else if (mode== 'light') {
                this.preferColorScheme = 'light'
                this.computeColors('Light')
            }
            console.log(this.preferColorScheme)
        }
    }
})