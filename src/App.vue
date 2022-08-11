<script setup lang="ts">
    import { ref, onMounted, ComputedRef, computed } from 'vue'

    import QRCode from './components/login/QRCode.vue'
    import Sidebar from './components/Sidebar.vue'
    import Sidestrip from './components/Sidestrip.vue'
    import MainPanel from './components/MainPanel.vue'

    import hal from './common/halogger'

    import { useMainStore } from './stores/mainStore'
    import { useConnStore } from './stores/connStore'
    import { useColorStore } from './stores/colorStore'

    import { useI18n } from 'vue-i18n'
    import BottomNav from './components/BottomNav.vue'

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const sideBarWidth: ComputedRef<string> = computed((): string => {
        let widthPercent = '30%'
        if (mainStore.page == 'home' || !mainStore.showSidebar) {
            widthPercent = '0%'
            return widthPercent
        } 

        if (mainStore.isMobile) {
            widthPercent = '100%'
        }

        return widthPercent
    })

    const showBottomNav: ComputedRef<boolean> = computed((): boolean => {
        if (!mainStore.isMobile) { return false }

        if (mainStore.mobileNavlessPanel == 'comments') {
            return false
        }

        return true
    })

    if (process.env.NODE_ENV?.toString() == 'development') {
        mainStore.isDebug = true
        mainStore.devCORSWorkaroundUrlPrefix = 'https://cors-anywhere.herokuapp.com/'
    }

    const gothamFontUrl = ref("https://web.halloapp.com/fonts/gotham/woff2/Gotham-Book_Web.woff2")
    const gothamMediumFontUrl = ref("https://web.halloapp.com/fonts/gotham/woff2/Gotham-Medium_Web.woff2")

    applyPlatformSpecifics()
    loadFonts()

    colorStore.init() // initialize color scheme
    init()

    async function init() {
        hal.log('app/init')
        hal.log('app/init/haveInitialHandshakeCompleted: ' + mainStore.haveInitialHandshakeCompleted)
        connStore.clearMessagesInQueue()

        mainStore.isConnectedToServer = false // needs to be reset on refresh
        connStore.connectToServerIfNeeded()        
    }

    function applyPlatformSpecifics() {
        const userAgent = navigator.userAgent || navigator.vendor || (<any>window).opera

        if ('ontouchstart' in document.documentElement && userAgent.match(/Mobi/)) {
            mainStore.isMobile = true
        } else {
            mainStore.isMobile = false
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !(<any>window).MSStream) {
            mainStore.isIOS = true
        }
        if (/android/i.test(userAgent)) {
            mainStore.isAndroid = true
        }

        if (userAgent.indexOf('Safari') != -1 && userAgent.indexOf('Chrome') == -1) {
            mainStore.isSafari = true
        } else if (navigator.userAgent.indexOf('Firefox') != -1) {
            mainStore.isFirefox = true
        }
    }

    /* 
        Fonts are loaded dynamically to make development on localhost easier 
            1. Assets on AWS are cors enabled and thus a proxy server is needed on localhost
            2. There's no way to use variables in @font-face src's url in css
    */
    function loadFonts() {

        let normalFont = gothamFontUrl.value
        let mediumFont = gothamMediumFontUrl.value

        // non-Safari browsers require a proxy server for font fetches
        if (!mainStore.isSafari) {
            normalFont = mainStore.devCORSWorkaroundUrlPrefix + normalFont
            mediumFont = mainStore.devCORSWorkaroundUrlPrefix + mediumFont
        }

        let style = document.createElement('style')

        style.appendChild(document.createTextNode("\
        @font-face {\
            font-family: 'Gotham';\
            src: url('" + normalFont + "') format('woff2');\
            font-weight: 300;\
            font-style: normal;\
        }\
        @font-face {\
            font-family: 'Gotham';\
            src: url('" + mediumFont + "') format('woff2');\
            font-weight: 500;\
            font-style: normal;\
        }\
        "))
        document.head.appendChild(style)
    }

</script>

<template>

    <div v-if="!mainStore.isLoggedIntoApp" id='signInWrapper'>

        <div id="signInWrapperHeader">
            <div id="logoBox">
                <svg width="31" height="31">
                    <use xlink:href="#icon"/>
                </svg>
                <div id="logoText">
                    HALLOAPP WEB
                </div>
            </div>
        </div>

        <div id='qrCodeBanner'>
            
            <div v-if='!mainStore.isMobile' id="howTo">
                <div class="howToTitle">
                    {{ t('login.howtoTitle') }}
                </div>
                <div class="howToBullet">
                    {{ t('login.howtoStepOne') }}
                </div>
                <div class="howToBullet" v-html="t('login.howtoStepTwo')">
                </div>
                <div class="howToBullet">
                    {{ t('login.howtoStepThree') }}
                </div>
            </div>

            <QRCode/>
        </div>

    </div>

    <div v-else id="MainWrapper">

        <div v-if='!mainStore.isMobile' id="Sidestrip">
            <Sidestrip/>
        </div>

        <!-- <div id="Sidebar" :class="[{'animateSlide': mainStore.page == 'groups'}]"> -->
        <div id="Sidebar" :class="[{'animateSlide': mainStore.animateSidebar}]">
            <Sidebar/>
        </div>

        <div id="MainPanel">
            <MainPanel/>
        </div>

        <div v-if='showBottomNav' id="BottomNav">
            <BottomNav/>
        </div>

    </div>


    <svg style="height: 0px;" xmlns="https://www.w3.org/2000/svg">
        <defs>
            <symbol id="icon" viewBox="0 0 34 33">
                <svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect id="app_icon 2" width="33.2488" height="33" rx="10" transform="matrix(1 0 0 -1 0.25 33)" fill="url(#pattern0)"/>
                    <defs>
                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image0_14888_19199" transform="translate(0 -0.00377019) scale(0.00555556)"/>
                        </pattern>
                        <image id="image0_14888_19199" data-name="app_icon.png" width="180" height="180" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAoiSURBVHgB7Z09UFRXFMcPGTuZURsxTUSxBpIOLcRMNKVAG0FMFdOIjqSUNWUkfhXBVGJMDdLqjKgzxi4RUsavpImm0YxQk/ff64uAgOy+c9+ee/j/Rl10kD2z+3vnnXffuWebFg7KghDihA+EEEdQaOIKCk1cQaGJKyg0cQWFJq6g0MQVFJq4gkITV1Bo4goKTVxBoYkrKDRxBYUmrqDQxBUUmriCQhNXUGjiCgpNXEGhiSsoNHEFhSauoNDEFRSauGKTbDR2d4rs6QyPLTtFdrSKNG999/uePwuPj2dE/nkq8ih7nL0jDaGlVaSjO8TcvEWkrXPlmOdehd+LY378UGT+lWwUmtxPTtqcvfGfHxXp6gkib94qhZi5I/Lghsj9KZEXzyQKiHFfFm/7/vCoEfPs3SzmLO4nD8UzPoWGAMhovSfCYywgyq1xkZvXRIX2bpH+kbgx4yC8XslivxvvgGwgvoSGyH2ZxH1DxbNaLUCMm+NB7HokOTQYREZpUSaI+fpZV2L7ERrZeKBSrsjLycWGJOsBGXn4avkiLwcZu96D0RjpC40LpNNXw6MVIMa5Y6tfREJgxByztKiVvBTRKp8aRNpCIysfvyhmmcxiGzu59N8snEnWAmcYxJzoykiaQkOGyqStDLcayHynD4TltIGsTu4dEvPkMSdYgqQnNE7Xo9ONrztrAWJAaEtl0ftAvKNZ2fTLDUmJtISGEMjMKcmcOucGs6XJdOrqdO4U5pnZau3pleHx8JiI1Gn0clDmxgKpscSYAPaFhsSp1cweSaTUsy80luUoc+Np3prEWdK20LglfOioECMgsWDp0TB2hcaL12/7xduQYB3dcD1tV+j+CksNq6D/xGjpYVNoiMxSwy54f/ps3vG0KTSyM7ENelIMZml7QjM7pwFWPXDRbgx7dwrLys7oVUCfAvbcYXvS3KLuMuwzxIGFix9sg8LfLVDdL/gwxP1k5u2+RwDBEGdXT3kxI/FM2up2tNfLcf1p3ItBSIA3AX2/622RRCY6MtI4sSHy5CWRiYv2YkZXXqM2D6+ArZIDG0JjyjyRSXH84yBHLf2+6BEe2LX+nSiaIOb+XaH5vp6Y0TE3F7G3eW+PWMKW0F2RXhy8ocNZJrkyVKxxHVJBrsWn+pig0b5ozBAbB3GsmPcdFkvYErpjv6iTy4wd2hqgtxk/L7bU2MKlVZ/GjBlnVEP3C+wIjV7nGC/M2FC4kNIEgnx/TKKB0gbjETTJpY5RfhgqO+wIHePiBafbWH28yPioxbVBFkVpEwNIHSPmtg6xgh2hY/QHxL6Ig3jaGS+WzDkoY7RjNrS1zI7Q23eKKsigsTd5Vteyp0QNZOfYO0PyJUBNWEOvQLPybVRN0dZCcw22rPVc7efBe2fkNrjfGlr7QnA1tFZPAKaGlgFi1i47min0UrRPW2XNlNB8nrIOQqA9SMZI2eF34HmZQ1K0nivmHb3llHVzqGQ4wd8SG2gweSwoNHEFhSauoNDEFRSauIJCE1dQaOIKCk1cQaGJKyg0cQWFJq6g0MQVFJq4gkITV1BoDbRaMefYbVcUCq0BZuMVBTvU2T5aGAqtAXZSF9ltgszciDFjDqHQGkDISm99H/yOcmU4zY8htkg6H7xpHQg5OhiyNcbZNm9b+/vnXoaRuJqbbAmFVgelR5mbXckSWHIQV1Bo4goKTVxBoYkrKDRxBYUmrqDQxBUUmriCQhNXUGjiCgpNXEGhiSsoNHEFhSauoNDEFRSauIJCE1dQaOIKCk1cQaGJKyg0cQWFJq7gGANtNm8V6eh+/4e5YzgNxh1wwIwqFFoLiDwwItI7VNN/qw6aGT1GsZVgyaFFZbJ2mQGy+ei0SEurkOJQaA0ODQYx6wUyn74qpDgUWoODR6UwbZ2hbCGFoNAa7GiVwuAisplCF4VCE1dQaOIKCk1cQaGJKyg0cQWFJq6g0MQVFJq4gkITV1Bo4goKTVxBoYkrKDRxBYUmrqDQxBV+hS6zWV7rudjgXxg7QmMXtCZlNstrPdeOnVIaGpsSDGJH6Hllods6pBSK7CVcTssuKQUcgNqbco3sWrcj9PNnokr7ASmF3Z2ixt7DUgqaB2EOhV7Giz9FlUMKG1fLfh6IVkYd3dUjqhiaKWJHaEwR0gSn1dhSQ8A2xQwN+uqY7VELKDW0Xxfts2sB7Aj9RFlo0F+Jm/FizNLoPRG3lsZros3jGbGC3wwNkI2OX5Ao9I/EmXaEM0tlIjsQt4k6mOwU46w1Oy1WsLVshzlv2mCqEeTTBD8vRqbLQRlz/LxIU5OocXAw3sE9c1esYOvGymykFwbyjUwWz6goXyBFTJlzcCD+8Gu2Xlyw/MBBgXiHI40aQxLSXnItgDGh70g09vWEoYj1nnLbu0Wu/FbfQMZ6QaY+dzvIXWu2xvd3ZEuX393WP0Mt5ua4WKJp4aAsiCXOTcdZJ10MlpmuV0TuT62dXZCRcSBgdl3smN5HNeaz4SyGr6vv2uK3rqn6qwoOviNnyom5f5epZTt7QiMDxqr1VgKnTFylQ+z5l+FiDCLjTuMeowMUcQGNpbInb+JGjI2IGdkZs60NYU9oXOX/9JSDC1Pg9IG4ZWId2Ou2w2rH5CUhxpmZNiczsNk+OnlRv/uO6HLllFjEptCQGRdAxCaonWPcCFPAboM/snSMGy2kGM+fmk42tnes4AqapYctILPhT+yyLTReuLGTQowwkZ01b10Ty9jfU3hrnPW0BR5ld0mv2E8uaWySxV29m7Yzg2v+zurms32SAuns+h4dpNSNADJ/82kyn3Sb1hgDSJ3sTRdbN2TXRWIyg/TmcowNJVZTL4SLqbHsRsRCQlI/zO4Efv1Jcp9Bbq+XY72gpfKrC7Z7Pl6/FPn527CmDtAOemZC5MOSxhXUAw46nAUTuABciXSFBvlnZDe6tXMl/shWBc5/+e4dNcSM/uRqX7bijhQNUGIg5oRvaKUtdA6y9ZERG9OAkJVvXA4rM2uBmL84YyNb51kZpZyh3Sf14ENoUM18lfLmcSwHUmDNHLVyLVIg5s8GMrFbpfSMjZiRjX88ZbY3o1b8CJ2Ti92+v4SMnb10r1+FjIyGnXovoBAzyqZqxs6+ji02RL5/Q2Tqsrt+GX9CLwandfXtUwthBQ4iPJgKa+Oap2ls+eo6HH7jgldl5/eimH+/F1ZdEi8tVsO30DnYktTZHUZgYZvSuqYdLSx5qGZfNLTP3gvZrQwhcCBC7N0dSw/Kpv//WMYqMWOLmfaBZ5SNIfRKQGqUJNt3ZpnwzVCXlo8yCf4KX89lF3fz/77dv2dBBsScTw7NRzJs3hLiBBZjLpmNKzRxCT+SgriCQhNXUGjiCgpNXEGhiSsoNHEFhSauoNDEFRSauIJCE1dQaOIKCk1cQaGJKyg0cQWFJq6g0MQVFJq4gkITV1Bo4goKTVxBoYkrKDRxBYUmrqDQxBWbxD4chEPWzX/VRQKVBfHoygAAAABJRU5ErkJggg=="/>
                    </defs>
                </svg>
            </symbol>
 
        </defs>
    </svg>

</template>

<!-- Global Styles -->
<style>

    * {
        box-sizing: border-box;
    }

    /* mobile iOS: prevent unsightly brief flicker of highlight when tapping */
    * {
        -webkit-tap-highlight-color: transparent;
    }

    @font-face {
        font-family: Emoji;
        src: local('Apple Color Emoji'), local('Noto Color Emoji'), local('Segoe UI');
        unicode-range: U+1F300-1F5FF, U+1F600-1F64F, U+1F680-1F6FF, U+2600-26FF;
    }

    html, body {
        height: 100%;
        width: 100%;
    }

    body {
        background: #F2F2F6;
        font-family: Emoji, Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;    
        font-size: 16px;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    a {
        color: rgba(0,0,0,.6);
        text-decoration: underline;
        font-weight: bold;
        transition: all 0.6s ease;
    }

    a:hover {
        text-decoration: underline;
        font-weight: bold;
        color: rgba(0,0,0,1);
        transition: all 0.15s ease;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: Nunito, Aria, "Helvetica Neue", Helvetica, sans-serif;
        font-weight: 400;
    }

    #app {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    #signInWrapper {
        width: 100%;
        height: 100%;
        
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow: auto;  
    }

    #signInWrapperHeader {
        margin-top: 20px;
        width: 80%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 5px 5px;    
    }
    #signInWrapperHeader #logoBox {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0px 8px;
    }
    #signInWrapperHeader #logoBox img {
        margin-top: 4px;
    }
    #signInWrapperHeader #logoText {
        font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
        font-size: 18px;
        font-weight: 600;
        color: rgb(0, 0 , 0, 0.8);
    }

    #qrCodeBanner {
        margin-top: 50px;
        margin-bottom: 100px;
        width: 100%;
        
        max-width: 800px;
        padding: 50px 30px 100px 30px;
        background-color: white;

        border-radius: 10px;
        box-shadow:
            0 1px 1px hsl(0deg 0% 0% / 0.075),
            0 2px 2px hsl(0deg 0% 0% / 0.075),
            0 4px 4px hsl(0deg 0% 0% / 0.075),
            0 8px 8px hsl(0deg 0% 0% / 0.075),
            0 16px 16px hsl(0deg 0% 0% / 0.075);

        overflow: hidden;  

        display: flex;
        flex-direction: horizontal;
        justify-content: center;
        align-items: flex-start;
        gap: 30px 30px;
    }
    #howTo .howToTitle {
        font-size: 24px;
        margin-bottom: 50px;
        color: rgb(0, 0, 0, 0.80);
    }

    #howTo .howToBullet {
        margin-bottom: 30px;
        font-size: 18px;
        color: rgb(0, 0, 0, 0.80);
    }

    #MainWrapper {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: horizonal;
    }

    #Sidestrip {
        background-color: black;
        flex: 0 0 auto;
        overflow: hidden;
    }

    #Sidebar {
        background-color: white;
        flex: 0 0 v-bind(sideBarWidth);
        overflow: hidden;
        
    }

    .animateSlide {
        transition: flex 300ms ease-in-out;
    }

    #MainPanel {
        flex: 1 1 auto;
        /* 
        * needed for mobile Safari where input box would keep expanding flexbox
        * reference: https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size
        */
        min-width: 0;
    }

    #BottomNav {
        position: absolute;
        bottom: 0px;
        z-index: 1;

        width: 100%;

        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px); /* mobile Safari */
    }

    @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
        #BottomNav {
            background-color: rgb(243, 243, 240); /* firefox does not support backdrop-filter yet */
        }
    }

    #Settings {
        display: flex;
    }

</style>
