/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Meta info of locales
 *
 * @since 0.8.0
 */
export type LocaleMessages = {
    [locale in timer.Locale | timer.TranslatingLocale]: {
        name: string
        comma?: string
    }
}

const _default: LocaleMessages = {
    zh_CN: {
        name: '简体中文',
        comma: '，'
    },
    zh_TW: {
        name: '正體中文',
        comma: '，',
    },
    en: {
        name: 'English',
        comma: ', '
    },
    ja: {
        name: '日本語',
        comma: '、'
    },
    pl: {
        name: 'Polski'
    },
    pt: {
        name: 'Português'
    },
    pt_BR: {
        name: 'Portugues, Brasil'
    },
    ko: {
        name: '한국인'
    },
    de: {
        name: 'Deutsch'
    },
    es: {
        name: 'Español'
    },
    ru: {
        name: 'Русский'
    },
    uk: {
        name: "українська"
    },
    fr: {
        name: "Français"
    },
    it: {
        name: "italiano"
    },
    sv: {
        name: "Sverige"
    },
}

export default _default