import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { i18n } from "./i18n"

import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import {
    faAngleDown,
    faAngleLeft,
    faAngleRight,
    faArrowLeft,
    faBell,
    faCaretRight,
    faCamera,
    faCheckDouble,
    faChevronLeft,
    faChevronRight,
    faCircleHalfStroke,
    faCircleQuestion,
    faFaceSmile,
    faFile,
    faFileLines,
    faGear,
    faHammer,
    faHouse,
    faImage,
    faLock,
    faMagnifyingGlass,
    faMessage,
    faMicrophone,
    faPaperclip,
    faPaperPlane,
    faPlay,
    faPlus,
    faPowerOff,
    faShieldHalved,
    faUserGroup,
    faUsers,
    faVideo,
    faXmark,
} from "@fortawesome/free-solid-svg-icons"

library.add(
    faAngleDown,
    faAngleLeft,
    faAngleRight,
    faArrowLeft,
    faBell,
    faCamera,
    faCaretRight,
    faCheckDouble,
    faChevronLeft,
    faChevronRight,
    faCircleHalfStroke,
    faCircleQuestion,
    faFaceSmile,
    faFile,
    faFileLines,
    faGear,
    faHammer,
    faHouse,
    faImage,
    faLock,
    faMagnifyingGlass,
    faMessage,
    faMicrophone,
    faPaperclip,
    faPaperPlane,
    faPlus,
    faPlay,
    faPowerOff,
    faShieldHalved,
    faUserGroup,
    faUsers,
    faVideo,
    faXmark)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(pinia)
    .use(i18n)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
