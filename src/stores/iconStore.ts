import { defineStore } from 'pinia'

import { useMainStore } from '@/stores/mainStore'

import commentLight from "@/assets/commentLight.png"
import commentDark from "@/assets/commentDark.png"

const iconList: {[key: string]: any} = {
    commentLight: commentLight,
    commentDark: commentDark,
}

export const useIconStore = defineStore('icon', {
    state: () => ({
        comment: iconList.commentLight
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
                            this.computeIcons('Dark')
                        } else {
                            this.computeIcons('Light')
                        }
                    }
                })
            // initialize icons
            if (mainStore.preferColorScheme == '') {
                this.changePreferColorSchema('auto')
            }
            else {
                this.changePreferColorSchema(mainStore.preferColorScheme)
            }
        },

        computeIcons(mode: string) {
            // todo: look for a way to iterate through all state instead of manually typing them
            this.comment = iconList['comment' + mode]
        },

        changePreferColorSchema(mode: string) {
            const mainStore = useMainStore()
            // auto mode
            if (mode == 'auto') {
                mainStore.preferColorScheme = 'auto'
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.computeIcons('Dark')
                }
                else {
                    this.computeIcons('Light')
                }
            }
            // change color manually
            else if (mode == 'dark') {
                mainStore.preferColorScheme = 'dark'
                this.computeIcons('Dark')
            }
            else if (mode == 'light') {
                mainStore.preferColorScheme = 'light'
                this.computeIcons('Light')
            }
        }
    }
})