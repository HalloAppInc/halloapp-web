import { createApp } from 'vue'
import App from './App.vue'

import { i18n } from "./i18n"

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import {
    faArrowLeft,
    faBell,
    faChevronLeft,
    faChevronRight,
    faCircleHalfStroke,
    faCircleQuestion,
    faFaceSmile,
    faFileLines,
    faGear,
    faHouse,
    faLock,
    faMessage,
    faMicrophone,
    faPaperclip,
    faPowerOff,
    faShieldHalved,
    faUserGroup,
    faUsers
} from "@fortawesome/free-solid-svg-icons"

library.add(
    faArrowLeft,
    faBell,
    faChevronLeft,
    faChevronRight,
    faCircleHalfStroke,
    faCircleQuestion,
    faFaceSmile,
    faFileLines,
    faGear,
    faHouse,
    faLock,
    faMessage,
    faMicrophone,
    faPaperclip,
    faPowerOff,
    faShieldHalved,
    faUserGroup,
    faUsers)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(pinia)
    .use(i18n)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
