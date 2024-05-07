/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getUILanguage } from "@api/chrome/i18n"
import optionService from "@service/option-service"

/**
 * Not to import this one if not necessary
 */
export type FakedLocale = timer.Locale
/**
 * @since 0.2.2
 */
export const FEEDBACK_LOCALE: timer.Locale = "en"

const ALL_LOCALE_VALIDATOR: { [locale in timer.Locale]: 0 } = {
    en: 0,
    zh_CN: 0,
    ja: 0,
    zh_TW: 0,
    pt_PT: 0,
    uk: 0,
    es: 0,
    de: 0,
}

export const ALL_LOCALES: timer.Locale[] = Object.keys(ALL_LOCALE_VALIDATOR) as timer.Locale[]

export const defaultLocale: timer.Locale = "zh_CN"

// Standardize the locale code according to the Chrome locale code
const chrome2I18n: { [key: string]: timer.Locale } = {
    'zh-CN': "zh_CN",
    'zh-TW': "zh_TW",
    'en': 'en',
    'en-US': "en",
    'en-GB': "en",
    'ja': "ja",
    'pt': 'pt_PT',
    'pt-PT': 'pt_PT',
    'pt-BR': 'pt_PT',
    'de': 'de',
}

const translationChrome2I18n: { [key: string]: timer.TranslatingLocale } = {
    ko: 'ko',
    pl: 'pl',
    ru: 'ru',
    fr: 'fr',
    it: 'it',
    sv: 'sv',
    fi: 'fi',
    da: 'da',
    hr: 'hr',
    id: 'id',
    tr: 'tr',
    cs: 'cs',
    ro: 'ro',
    nl: 'nl',
    vi: 'vi',
    sk: 'sk',
    mn: 'mn',
}

/**
 * Codes returned by getUILanguage() are defined by Chrome browser
 * @see https://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc
 * But supported locale codes in Chrome extension
 * @see https://developer.chrome.com/docs/webstore/i18n/#localeTable
 *
 * They are different, so translate
 */
export function chromeLocale2ExtensionLocale(chromeLocale: string): timer.Locale {
    if (!chromeLocale) {
        return defaultLocale
    }
    return chrome2I18n[chromeLocale] || FEEDBACK_LOCALE
}

/**
 * @since 0.9.0
 */
export let localeSameAsBrowser: timer.Locale = chromeLocale2ExtensionLocale(getUILanguage())

/**
 * @since 1.5.0
 */
export function isTranslatingLocale(): boolean {
    const uiLang = getUILanguage()
    if (chrome2I18n[uiLang]) {
        return false
    }
    return !!translationChrome2I18n[uiLang]
}

/**
 * Real locale with locale option
 */
export let locale: timer.Locale = localeSameAsBrowser

function handleLocaleOption(option: timer.option.AllOption) {
    const localOption: timer.option.LocaleOption = option.locale
    if (!localOption || localOption === "default") {
        locale = chromeLocale2ExtensionLocale(getUILanguage())
    } else {
        locale = localOption as timer.Locale
    }
    const htmlEl = document.getElementsByTagName("html")?.[0]
    htmlEl.setAttribute("data-locale", locale)
}

/**
 * Please invoke this function before doing anything
 * @since 0.8.0
 */
export async function initLocale() {
    const option = await optionService.getAllOption()
    handleLocaleOption(option)
}

optionService.addOptionChangeListener(handleLocaleOption)

function tryGetOriginalI18nVal<MessageType>(
    messages: Messages<MessageType>,
    keyPath: I18nKey<MessageType>,
    specLocale?: timer.Locale
) {
    try {
        return keyPath(messages[specLocale || locale])
    } catch (ignore) {
        return undefined
    }
}

export function getI18nVal<MessageType>(
    messages: Messages<MessageType>,
    keyPath: I18nKey<MessageType>,
    specLocale?: timer.Locale
): string {
    const result = tryGetOriginalI18nVal(messages, keyPath, specLocale)
        || keyPath(messages[FEEDBACK_LOCALE])
        || ''
    return typeof result === 'string' ? result : JSON.stringify(result)
}

export type TranslateProps<MessageType> = {
    key: I18nKey<MessageType>,
    param?: { [key: string]: string | number }
}

function fillWithParam(result: string, param: { [key: string]: string | number }) {
    if (!result) {
        return ''
    }
    Object.entries(param)
        .filter(([_key, value]) => value !== null && value !== undefined)
        .forEach(([key, value]) => result = result.replace(`{${key}}`, value.toString()))
    return result
}

export function t<MessageType>(messages: Messages<MessageType>, props: TranslateProps<MessageType>, specLocale?: timer.Locale): string {
    const { key, param } = props
    const result: string = getI18nVal(messages, key, specLocale)
    return param ? fillWithParam(result, param) : result
}

export type I18nKey<MessageType> = (messages: MessageType | EmbeddedPartial<MessageType>) => any

export type I18nResultItem<Node> = Node | string

const findParamAndReplace = <Node,>(resultArr: I18nResultItem<Node>[], [key, value]: any) => {
    const paramPlacement = `{${key}}`
    const temp = []
    resultArr.forEach((item) => {
        if (typeof item === 'string' && item.includes(paramPlacement)) {
            // 将 string 替换成具体的 VNode
            let splits: I18nResultItem<Node>[] = (item as string).split(paramPlacement)
            splits = splits.reduce((left, right) => left.length ? left.concat(value, right) : left.concat(right), [])
            temp.push(...splits)
        } else {
            temp.push(item)
        }
    })
    return temp
}

export type NodeTranslateProps<MessageType, Node> = {
    key: I18nKey<MessageType>,
    param: { [key: string]: I18nResultItem<Node> }
}

/**
 * Translate with slots for vue
 * I18nResultItemArray of VNodes or strings
 */
export const tN = <MessageType, Node>(messages: Messages<MessageType>, props: NodeTranslateProps<MessageType, Node>): I18nResultItem<Node>[] => {
    const { key, param } = props
    const result = getI18nVal(messages, key)
    let resultArr: I18nResultItem<Node>[] = [result]
    if (param) {
        resultArr = Object.entries(param).reduce(findParamAndReplace, resultArr)
    }
    return resultArr
}

export const getNumberSeparator = () => {
    try {
        const jsLocale = locale?.substring(0, 2)
        const str = (1000).toLocaleString(jsLocale)
        if (str.length === 4) return ''
        return str.substring(1, 2)
    } catch {
        return ''
    }
}