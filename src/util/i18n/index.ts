/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export enum Locale {
    ZH_CN = 'zh_CN',
    EN = 'en',
    JA = 'ja'
}

/**
 * @since 0.2.2
 */
const FEEDBACK_LOCALE = Locale.EN

export const defaultLocale = Locale.ZH_CN

export type Messages<T> = {
    [key in Locale]: T
}

// Standardize the locale code according to the Chrome locale code
const chrome2I18n: { [key: string]: Locale } = {
    'zh-CN': Locale.ZH_CN,
    'zh-TW': Locale.ZH_CN,
    'en-US': Locale.EN,
    'en-GB': Locale.EN,
    'ja': Locale.JA
}

/**
 * Codes returned by getUILanguage() are defined by Chrome browser
 * @see https://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc 
 * But supported locale codes in Chrome extension
 * @see https://developer.chrome.com/docs/webstore/i18n/#localeTable
 * 
 * They are different, so translate
 */
const chromeLocale2ExtensionLocale: (chromeLocale: string) => Locale = (chromeLocale: string) => {
    if (!chromeLocale) {
        return defaultLocale
    }
    return chrome2I18n[chromeLocale] || FEEDBACK_LOCALE
}

export const locale = chromeLocale2ExtensionLocale(chrome.i18n.getUILanguage())

export function getI18nVal<MessageType>(messages: MessageType, keyPath: I18nKey<MessageType>): string {
    const result = keyPath(messages)
    return typeof result === 'string' ? result : JSON.stringify(result)
}

export type TranslateProps<MessageType> = {
    key: I18nKey<MessageType>,
    param?: { [key: string]: string | number }
}

/**
 * Translate
 * @param key     keyPath 
 * @param param   param
 * @returns string or vnodes[]
 */
export function t<MessageType>(messages: MessageType, props: TranslateProps<MessageType>): string {
    const { key, param } = props
    let result: string = getI18nVal(messages, key)
    if (param) {
        for (const [key, value] of Object.entries(param)) {
            result = (result as string).replace(`{${key}}`, value.toString())
        }
    }
    return result
}

export type I18nKey<MessageType> = (messages: MessageType) => any
