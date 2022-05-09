/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from ".."
import appMessages, { AppMessage } from "../components/app"
import contentScriptMessages, { ContentScriptMessage } from "../components/content-script"
import contextMenusMessages, { ContextMenusMessage } from "../components/context-menus"
import initialMessages, { InitialMessage } from "../components/initial"

export type ChromeMessage = {
    app: AppMessage
    message: ContentScriptMessage
    contextMenus: ContextMenusMessage
    initial: InitialMessage
}

const messages: Messages<ChromeMessage> = {
    zh_CN: {
        app: appMessages.zh_CN,
        message: contentScriptMessages.zh_CN,
        contextMenus: contextMenusMessages.zh_CN,
        initial: initialMessages.zh_CN,
    },
    zh_TW: {
        app: appMessages.zh_TW,
        message: contentScriptMessages.zh_TW,
        contextMenus: contextMenusMessages.zh_TW,
        initial: initialMessages.zh_TW,
    },
    en: {
        app: appMessages.en,
        message: contentScriptMessages.en,
        contextMenus: contextMenusMessages.en,
        initial: initialMessages.en,
    },
    ja: {
        app: appMessages.ja,
        message: contentScriptMessages.ja,
        contextMenus: contextMenusMessages.ja,
        initial: initialMessages.ja,
    }
}

export default messages

const placeholder: ChromeMessage = {
    app: {
        name: '',
        description: '',
        marketName: '',
        currentVersion: ''
    },
    message: {
        openTimesConsoleLog: '',
        usedTimeInConsoleLog: '',
        timeWithHour: '',
        timeWithMinute: '',
        timeWithSecond: '',
        timeLimitMsg: '',
        more5Minutes: ''
    },
    contextMenus: {
        add2Whitelist: '',
        removeFromWhitelist: '',
        allFunctions: '',
        optionPage: '',
        repoPage: '',
        feedbackPage: '',
    },
    initial: {
        localFile: {
            pdf: '',
            json: '',
            pic: '',
            txt: '',
        }
    }
}

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

export const router: ChromeMessage = routerPath(placeholder) as unknown as ChromeMessage
