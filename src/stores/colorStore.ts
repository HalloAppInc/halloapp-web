import { defineStore } from 'pinia';

import colors from '../common/colors';

import { useMainStore } from './mainStore';

export const useColorStore = defineStore('color', {
    state: () => ({
        primaryBlue: colors.primaryBlueLight,
        primaryLightgray: colors.primaryLightgrayLight,
        primaryWhiteBlack: colors.primaryWhiteBlackLight,
        background: colors.backgroundLight,
        secondaryBg: colors.secondaryBgLight,
        tertiaryBg: colors.tertiaryBgLight,
        header: colors.headerLight,
        hover: colors.hoverLight,
        text: colors.textLight,
        hoverText: colors.hoverTextLight,
        hoverTextBackground: colors.hoverTextBackgroundLight,
        
        borderline: colors.borderlineLight,
        secondaryText: colors.secondaryTextLight,
        secondaryBgHover: colors.secondaryBgHoverLight,
        secondaryBgSelected: colors.secondaryBgSelectedLight,
        secondaryBorder: colors.secondaryBorderLight,
        icon: colors.iconLight,
        wrapper: colors.wrapperLight,
        shadow: colors.shadowLight,
        line: colors.lineLight,
        chatBox: colors.chatBox,
        chatBackground: colors.chatBackgroundLight,
        outBoundMsgBubble: colors.outBoundMsgBubbleLight,
        inBoundMsgBubble: colors.inBoundMsgBubbleLight,
        timestamp: colors.timestampLight,
        timeBubble: colors.timeBubbleLight,
        colorList: colors.colorListLight,
        nameList: colors.nameListLight,
        cursor: colors.cursorLight,
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
            this.primaryLightgray = colors['primaryLightgray' + mode]
            this.primaryWhiteBlack = colors['primaryWhiteBlack' + mode]
            this.background = colors['background' + mode]
            this.secondaryBg = colors['secondaryBg' + mode]
            this.tertiaryBg = colors['tertiaryBg' + mode]
            this.header = colors['header' + mode]
            this.hover = colors['hover' + mode]
            this.text = colors['text' + mode]
            this.hoverText = colors['hoverText' + mode]
            this.hoverTextBackground = colors['hoverTextBackground' + mode]
            this.primaryBlue = colors['primaryBlue' + mode]
            this.secondaryText = colors['secondaryText' + mode]
            this.secondaryBgHover = colors['secondaryBgHover' + mode]
            this.secondaryBgSelected = colors['secondaryBgSelected' + mode]
            this.borderline = colors['borderline' + mode]
            this.secondaryBorder = colors['secondaryBorder' + mode]
            this.icon = colors['icon' + mode]
            this.wrapper = colors['wrapper' + mode]
            this.shadow = colors['shadow' + mode]
            this.line = colors['line' + mode]
            this.chatBox = colors['chatBox' + mode]
            this.chatBackground = colors['chatBackground' + mode]
            this.outBoundMsgBubble = colors['outBoundMsgBubble' + mode]
            this.inBoundMsgBubble = colors['inBoundMsgBubble' +  mode]
            this.timestamp = colors['timestamp' + mode]
            this.timeBubble = colors['timeBubble' + mode]
            this.colorList = colors['colorList' + mode] /* colors of selectable chat background */
            this.nameList = colors['nameList' + mode]
            this.cursor = colors['cursor' + mode]
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