export const setRtl = () => {
    if (hasNotDoc()) return
    const htmlEl = document.getElementsByTagName("html")?.[0]
    htmlEl?.setAttribute('dir', 'rtl')
}

export const setLocale = (locale: timer.Locale) => {
    if (hasNotDoc()) return
    const htmlEl = document.getElementsByTagName("html")?.[0]
    htmlEl?.setAttribute('data-locale', locale)
}

const hasNotDoc = () => {
    if (typeof window === 'undefined') return
    return !window?.document
}

export const isRtl = (): boolean => {
    if (hasNotDoc()) return false
    const htmlEl = document.getElementsByTagName("html")?.[0]
    return htmlEl?.getAttribute('dir') === 'rtl'
}