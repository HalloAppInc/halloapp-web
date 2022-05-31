import { defineStore } from 'pinia';

import colors from '../common/colors';

export const useColorStore = defineStore('color',{
    state: () => ({
        // for color schema
        preferColorScheme: 'light',

        // color
        mainBackground: colors.backgroundWhite,
        header: colors.headerWhite,
        hover: colors.hoverWhite,
        text: colors.textLight,
        borderline: colors.borderlineLight,
        text1: colors.text1Light,
    }),
    getters: {
    },
    actions: {
        init() {
            // listen to the color scheme of the browser
            window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', event => {
                console.log("auto mode");
                if (event.matches) {
                    this.mainBackground = colors.backgroundBlack;
                    this.header = colors.headerBlack;
                    this.hover = colors.hoverBlack;
                    this.text = colors.textDark;
                    this.text1 = colors.text1Dark;
                    this.borderline = colors.borderlineDark;
                    this.preferColorScheme = "auto-dark";
                } else {
                    this.mainBackground = colors.backgroundWhite;
                    this.header = colors.headerWhite;
                    this.hover = colors.hoverWhite;
                    this.text = colors.textLight;
                    this.text1 = colors.text1Light;
                    this.borderline = colors.borderlineLight;
                    this.preferColorScheme = "auto-light";
                }   
            })
        },

        changePreferColorSchema(mode: string) {
            // auto mode
            if (mode == 'auto') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.mainBackground = colors.backgroundBlack;
                    this.header = colors.headerBlack;
                    this.hover = colors.hoverBlack;
                    this.text = colors.textDark;
                    this.text1 = colors.text1Dark;
                    this.borderline = colors.borderlineDark;
                    this.preferColorScheme = 'auto-dark';
                }
                else {
                    this.mainBackground = colors.backgroundWhite;
                    this.header = colors.headerWhite;
                    this.hover = colors.hoverbWhite;;
                    this.text = colors.textLight;
                    this.text1 = colors.text1Light;
                    this.borderline = colors.borderlineLight;
                    this.preferColorScheme = 'auto-light';
                }
                this.init();
            }
            // change color manually
            else if (mode == 'dark') {
                this.mainBackground = colors.backgroundBlack;
                this.header = colors.headerBlack;
                this.hover = colors.hoverBlack;
                this.text = colors.textDark;
                this.text1 = colors.text1Dark;
                this.borderline = colors.borderlineDark;
                this.preferColorScheme = 'dark';
            }
            else if (mode == 'light') {
                this.mainBackground = colors.backgroundWhite;
                this.header = colors.headerWhite;
                this.hover = colors.hoverWhite;
                this.text = colors.textLight;
                this.text1 = colors.text1Light;
                this.borderline = colors.borderlineLight;
                this.preferColorScheme = 'light';
            }
        },        
    }
})