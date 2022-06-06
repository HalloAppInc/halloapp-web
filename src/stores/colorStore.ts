import { defineStore } from 'pinia';

import colors from '../common/colors';

import { useMainStore } from './mainStore';

export const useColorStore = defineStore('color', {
    state: () => ({
        // color
        background: colors.backgroundLight,
        header: colors.headerLight,
        hover: colors.hoverLight,
        text: colors.textLight,
        borderline: colors.borderlineLight,
        secondaryText: colors.secondaryTextLight,
        icon: colors.iconLight,
        wraper: colors.wraperLight,
        shadow: colors.shadowLight,
        line: colors.lineLight,
        myChatBubble: colors.myChatBubbleLight,
        othersChatBubble: colors.othersChatBubbleLight,
        messageBubble: colors.messageBubbleLight,
        timestamp: colors.timestampLight,
        chatBackground: colors.chatBackgroundLight
    }),
    getters: {
    },
    actions: {
        init() {
            const mainStore = useMainStore()
            // add listener to the color scheme of the browser
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
            // initialize colors
            if (mainStore.preferColorScheme == '') {
                this.changePreferColorSchema('auto')
            }
            else {
                this.changePreferColorSchema(mainStore.preferColorScheme)
            }
        },

        computeColors(mode: string) {
            this.background = colors['background' + mode]
            this.header = colors['header' + mode]
            this.hover = colors['hover' + mode]
            this.text = colors['text' + mode]
            this.secondaryText = colors['secondaryText' + mode]
            this.borderline = colors['borderline' + mode]
            this.icon = colors['icon' + mode]
            this.wraper = colors['wraper' + mode]
            this.shadow = colors['shadow' + mode]
            this.line = colors['line' + mode]
            this.myChatBubble = colors['myChatBubble' + mode],
            this.othersChatBubble = colors['othersChatBubble' + mode]
            this.messageBubble = colors['messageBubble' + mode]
            this.timestamp = colors['timestamp' + mode]
            this.chatBackground = colors['chatBackground' + mode]
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
        }
    }
})