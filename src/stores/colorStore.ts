import { defineStore } from 'pinia';

import colors from '../common/colors';

import { useMainStore } from './mainStore';

export const useColorStore = defineStore('color', {
    state: () => ({
        // for color schema
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
        init() {
            const mainStore = useMainStore()
            // add listener to the color scheme of the browser
            if (!this.createListener) {
                this.createListener = true // only create one listener
                window.matchMedia('(prefers-color-scheme: dark)')
                    .addEventListener('change', event => {
                        if (mainStore.preferColorScheme == 'auto') {
                            if (event.matches) {
                                this.computeColors('Dark')
                            } else {
                                this.computeColors('Light')
                            }
                        }
                    })
            }
            // initialize colors
            this.changePreferColorSchema(mainStore.preferColorScheme)
        },

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
            const mainStore = useMainStore()
            // auto mode
            if (mode == 'auto') {
                mainStore.preferColorScheme = 'auto'
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.computeColors('Dark')
                }
                else {
                    this.computeColors('Light')
                }
            }
            // change color manually
            else if (mode == 'dark') {
                mainStore.preferColorScheme = 'dark'
                this.computeColors('Dark')
            }
            else if (mode == 'light') {
                mainStore.preferColorScheme = 'light'
                this.computeColors('Light')
            }
            console.log(mainStore.preferColorScheme)
        }
    }
})