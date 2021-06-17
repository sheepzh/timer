import { Messages } from ".."
import appMessages, { AppMessage } from "../components/app"
import contentScriptMessages, { ContentScriptMessage } from "../components/content-script"
import contextMenusMessages, { ContextMenusMessage } from "../components/context-menus"

export type ChromeMessage = {
    app: AppMessage
    message: ContentScriptMessage,
    contextMenus: ContextMenusMessage
}

const messages: Messages<ChromeMessage> = {
    zh_CN: {
        app: appMessages.zh_CN,
        message: contentScriptMessages.zh_CN,
        contextMenus: contextMenusMessages.zh_CN
    },
    en: {
        app: appMessages.en,
        message: contentScriptMessages.en,
        contextMenus: contextMenusMessages.en
    },
    ja: {
        app: appMessages.ja,
        message: contentScriptMessages.ja,
        contextMenus: contextMenusMessages.ja
    }
}

export default messages

function routerPath(root: any, parentPath = undefined) {
    Object.entries(root)
        .forEach(([key, value]) => {
            const currentPath = parentPath ? `${parentPath}_${key}` : key
            if (typeof value === 'string') {
                root[key] = currentPath
            } else {
                root[key] = routerPath(value, currentPath)
            }
        })
    return root
}

export const router: ChromeMessage = routerPath(messages.zh_CN) as unknown as ChromeMessage