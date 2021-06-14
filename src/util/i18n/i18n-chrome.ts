import { Locale, Messages } from ".";
import appMessages, { AppMessage } from "./components/app";
import contentScriptMessages, { ContentScriptMessage } from "./components/content-script";

type ChromeMessage = {
    app: AppMessage
    message: ContentScriptMessage
}

const messages: Messages<ChromeMessage> = {
    zh_CN: {
        app: appMessages.zh_CN,
        message: contentScriptMessages.zh_CN
    },
    en: {
        app: appMessages.en,
        message: contentScriptMessages.en
    },
    ja: {
        app: appMessages.ja,
        message: contentScriptMessages.ja
    }
}

// Genearate the messages used by Chrome
function translate(obj: any, parentKey = ''): any {
    const result = {}
    if (typeof obj === 'object') {
        for (const key in obj) {
            const val = obj[key]
            // key of Chrome message
            const messageKey = !!parentKey ? `${parentKey}_${key}` : key
            const children = translate(val, messageKey)
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
    zh_CN: translate(messages.zh_CN),
    en: translate(messages.en),
    ja: translate(messages.ja)
}

export default _default