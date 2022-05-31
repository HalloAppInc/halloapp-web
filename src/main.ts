import { createApp } from 'vue'
import App from './App.vue'

import { i18n } from "./i18n"

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { library } from '@fortawesome/fontawesome-svg-core'
import {faFileLines, faUsers, faCircleQuestion, faCircleHalfStroke, faShieldHalved, faLock, faBell, faArrowLeft, faHouse, faUserGroup, faMessage, faGear, faPowerOff, faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(faHouse, faUserGroup, faMessage, faGear, faPowerOff, faChevronRight, faChevronLeft, faArrowLeft, faBell, faLock, faShieldHalved, faCircleHalfStroke, faCircleQuestion, faUsers, faFileLines)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(pinia)
    .use(i18n)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
