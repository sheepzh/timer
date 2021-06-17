import { Locale } from ".."
import messages from "./message"

// Genearate the messages used by Chrome
function translateForChrome(obj: any, parentKey = ''): any {
    const result = {}
    if (typeof obj === 'object') {
        for (const key in obj) {
            const val = obj[key]
            // key of Chrome message
            const messageKey = !!parentKey ? `${parentKey}_${key}` : key
            const children = translateForChrome(val, messageKey)
            // copy from child
            for (const childKey in children) {
                result[childKey] = children[childKey]
            }
        }
    } else {
        result[parentKey] = {
            message: obj + '',
            description: 'None'
        }
    }
    return result
}

const _default: { [locale in Locale]: any } = {
    zh_CN: translateForChrome(messages.zh_CN),
    en: translateForChrome(messages.en),
    ja: translateForChrome(messages.ja)
}

export default _default