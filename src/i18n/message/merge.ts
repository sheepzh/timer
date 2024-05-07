import { ALL_LOCALES } from ".."

export type MessageRoot<T = any> = { [key in keyof T]: Messages<T[key]> }

export function merge<T>(messageRoot: MessageRoot<T>): Required<Messages<T>> {
    const result = {}
    ALL_LOCALES.forEach(locale => {
        const message = messageOfRoot(locale, messageRoot)
        result[locale] = message as T & EmbeddedPartial<T>
    })
    return result as Required<Messages<T>>
}

function messageOfRoot<T>(locale: timer.Locale, messageRoot: MessageRoot<T>): T {
    const entries: [string, any][] = Object.entries(messageRoot).map(([key, val]) => ([key, val[locale]]))
    const result = Object.fromEntries(entries) as T
    return result
}