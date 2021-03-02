import Vue from 'vue'
import VueI18n from 'vue-i18n'
const { vueMessages, defaultLocale } = require('../locale/index')
Vue.use(VueI18n)

// Standardize the locale code according to the Chrome locale code
const chrome2I18n = {
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW',
    'en-US': 'en',
    'en-GB': 'en'
}

/**
 * Codes returend by getUILanguage() are defined by Chrome browser
 * @see https://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc 
 * But supported locale codes in Chrome extension
 * @see https://developer.chrome.com/docs/webstore/i18n/#localeTable
 * 
 * They are different, so translate
 */
const chromeLocale2ExtensionLocale = chromeLocale => {
    if (!chromeLocale) {
        return undefined
    }
    return chrome2I18n[chromeLocale] || chromeLocale
}

const option = {
    messages: vueMessages,
    fallbackLocale: defaultLocale,
    locale: chromeLocale2ExtensionLocale(chrome.i18n.getUILanguage()) || defaultLocale,
}

export default new VueI18n(option)
