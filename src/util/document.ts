import { anyMatch } from "./array"

export const setDir = (direction: 'ltr' | 'rtl') => {
    if (isNotExtensionPage()) return
    const htmlEl = document.getElementsByTagName("html")?.[0]
    htmlEl?.setAttribute('dir', direction)
}

export const setLocale = (locale: timer.Locale) => {
    if (isNotExtensionPage()) return
    const htmlEl = document.getElementsByTagName("html")?.[0]
    htmlEl?.setAttribute('data-locale', locale)
}

const isNotExtensionPage = (): boolean => {
    if (typeof location === 'undefined' || typeof chrome === 'undefined' || typeof window === 'undefined') {
        return true
    }
    if (location.hostname !== chrome.runtime?.id) return true

    return !window?.document
}

export const isRtl = (): boolean => {
    if (isNotExtensionPage()) return false
    const htmlEl = document.getElementsByTagName("html")?.[0]
    return htmlEl?.getAttribute('dir') === 'rtl'
}