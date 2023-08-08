/**
 * Copyright (c) 2021-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import metaMessages, { MetaMessage } from "../message/common/meta"
import contextMenusMessages, { ContextMenusMessage } from "../message/common/context-menus"
import initialMessages, { InitialMessage } from "../message/common/initial"
import baseMessages, { BaseMessage } from "../message/common/base"

export type ChromeMessage = {
    meta: MetaMessage
    base: BaseMessage
    contextMenus: ContextMenusMessage
    initial: InitialMessage
}

const messages: Messages<ChromeMessage> = {
    zh_CN: {
        meta: metaMessages.zh_CN,
        base: baseMessages.zh_CN,
        contextMenus: contextMenusMessages.zh_CN,
        initial: initialMessages.zh_CN,
    },
    zh_TW: {
        meta: metaMessages.zh_TW,
        base: baseMessages.zh_TW,
        contextMenus: contextMenusMessages.zh_TW,
        initial: initialMessages.zh_TW,
    },
    en: {
        meta: metaMessages.en,
        base: baseMessages.en,
        contextMenus: contextMenusMessages.en,
        initial: initialMessages.en,
    },
    ja: {
        meta: metaMessages.ja,
        base: baseMessages.ja,
        contextMenus: contextMenusMessages.ja,
        initial: initialMessages.ja,
    },
    pt_PT: {
        meta: metaMessages.pt_PT,
        base: baseMessages.pt_PT,
        contextMenus: contextMenusMessages.pt_PT,
        initial: initialMessages.pt_PT,
    }
}

export default messages

const placeholder: ChromeMessage = {
    meta: {
        name: '',
        description: '',
        marketName: '',
        slogan: '',
    },
    base: {
        currentVersion: '',
        allFunction: '',
        guidePage: '',
        changeLog: '',
    },
    contextMenus: {
        add2Whitelist: '',
        removeFromWhitelist: '',
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
