/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import baseMessages, { BaseMessage } from "../message/common/base"
import contextMenusMessages, { ContextMenusMessage } from "../message/common/context-menus"
import initialMessages, { InitialMessage } from "../message/common/initial"
import metaMessages, { MetaMessage } from "../message/common/meta"

export type ChromeMessage = {
    meta: MetaMessage
    base: BaseMessage
    contextMenus: ContextMenusMessage
    initial: InitialMessage
}

const messages: Required<Messages<ChromeMessage>> = {
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
    },
    uk: {
        meta: metaMessages.uk,
        base: baseMessages.uk,
        contextMenus: contextMenusMessages.uk,
        initial: initialMessages.uk,
    },
    es: {
        meta: metaMessages.es,
        base: baseMessages.es,
        contextMenus: contextMenusMessages.es,
        initial: initialMessages.es,
    },
    de: {
        meta: metaMessages.de,
        base: baseMessages.de,
        contextMenus: contextMenusMessages.de,
        initial: initialMessages.de,
    },
    fr: {
        meta: metaMessages.fr,
        base: baseMessages.fr,
        contextMenus: contextMenusMessages.fr,
        initial: initialMessages.fr,
    },
    ru: {
        meta: metaMessages.ru,
        base: baseMessages.ru,
        contextMenus: contextMenusMessages.ru,
        initial: initialMessages.ru,
    }
}

export default messages

const placeholder: ChromeMessage = {
    meta: {
        name: '',
        description: '',
        marketName: '',
    },
    base: {
        allFunction: '',
        guidePage: '',
        changeLog: '',
        option: '',
        sourceCode: '',
    },
    contextMenus: {
        add2Whitelist: '',
        removeFromWhitelist: '',
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

function routerPath(root: any, parentPath = '') {
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
