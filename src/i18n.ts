import { createI18n } from 'vue-i18n'

import en from './locales/en.json' // English * Default *

const defaultLocale = 'en'
const supportedLocales = ['en']
const locale = getLocale()

export const i18n = createI18n({
    legacy: false,
    locale: locale,
    fallbackLocale: defaultLocale,
    messages: {
        en,
    }
})

function getLocale() {
    const languages = navigator.languages
    const locale = languages !== undefined ? languages[0] : navigator.language
    if (!locale) { return undefined }
    const trimmedLocale = locale.trim().split(/-|_/)[0]

    if (supportedLocales.includes(trimmedLocale)) {
        return trimmedLocale
    } else {
        return defaultLocale
    }
}