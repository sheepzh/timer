import { VNode } from 'vue'
import messages from '../locale'
import { defaultLocale, Locale } from '../locale/constant'

// Standardize the locale code according to the Chrome locale code
const chrome2I18n: { [key: string]: Locale } = {
  'zh-CN': Locale.ZH_CN,
  'zh-TW': Locale.ZH_CN,
  'en-US': Locale.EN,
  'en-GB': Locale.EN,
  'ja': Locale.JA
}

/**
 * Codes returend by getUILanguage() are defined by Chrome browser
 * @see https://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc 
 * But supported locale codes in Chrome extension
 * @see https://developer.chrome.com/docs/webstore/i18n/#localeTable
 * 
 * They are different, so translate
 */
const chromeLocale2ExtensionLocale = (chromeLocale: string) => {
  if (!chromeLocale) {
    return defaultLocale
  }
  return chrome2I18n[chromeLocale] || chromeLocale
}

export const locale = chromeLocale2ExtensionLocale(chrome.i18n.getUILanguage())

const message: any = messages[locale] || {}

export declare type I18nResultItem = VNode | string

function getI18nVal(keyPath: string): string {
  const levels = keyPath.split('.')
  let currentMessage: any = message
  for (let i in levels) {
    const level = levels[i]
    currentMessage = currentMessage[level]
    if (!currentMessage) {
      return keyPath
    }
  }
  return typeof currentMessage === 'string' ? currentMessage : JSON.stringify(currentMessage)
}

/**
 * Translate with slots
 * 
 * @param key key path
 * @param param param, slot vnodes
 * @returns The array of vnodes or strings
 */
export function tN(key: string, param: { [key: string]: I18nResultItem }): I18nResultItem[] {
  const result = getI18nVal(key)
  let resultArr: I18nResultItem[] = []
  resultArr.push(result)
  Object.keys(param).forEach(key => {
    const temp: I18nResultItem[] = []
    for (let i = 0; i < resultArr.length; i++) {
      const item = resultArr[i]
      const paramPlacement = `{${key}}`
      if (typeof item === 'string' && item.includes(paramPlacement)) {
        const value = param[key]
        // 将 string 替换成具体的 Vnode
        let splited: I18nResultItem[] = (item as string).split(paramPlacement)
        splited = splited.reduce((left, right) => left.length ? left.concat(value, right) : left.concat(right), [])
        temp.push(...splited)
      } else {
        temp.push(item)
      }
    }
    resultArr = temp
  })
  return resultArr
}

/**
 * Translate
 * @param key     keyPath 
 * @param param   param
 * @returns string or vnodes[]
 */
export function t(key: string, param?: { [key: string]: string | number }): string {
  let result: string = getI18nVal(key)
  if (param) {
    for (const [key, value] of Object.entries(param)) {
      result = (result as string).replace(`{${key}}`, value.toString())
    }
  }
  return result
}
