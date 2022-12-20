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
    [locale in timer.Locale | timer.TranslatingLocale]: string
}

const _default: LocaleMessages = {
    zh_CN: '简体中文',
    zh_TW: '正體中文',
    en: 'English',
    ja: '日本語',
    pl: 'Polski',
    pt: 'Português',
    pt_BR: 'Portugues, Brasil',
    ko: '한국인',
    de: 'Deutsch',
    es: 'Español',
    ru: 'Русский',
    uk: "українська",
    fr: "Français",
    it: "italiano",
    sv: "Sverige",
}

export default _default