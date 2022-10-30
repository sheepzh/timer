/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Messages } from ".."
import chromeBase from "./app"

/**
 * Used for menu
 */
export type ContextMenusMessage = {
    add2Whitelist: string
    removeFromWhitelist: string
    allFunctions: string
    optionPage: string
    repoPage: string
    feedbackPage: string
    guidePage: string
}

const _default: Messages<ContextMenusMessage> = {
    zh_CN: {
        add2Whitelist: '将{host}加入白名单',
        removeFromWhitelist: '将{host}从白名单移出',
        allFunctions: chromeBase.zh_CN.allFunction,
        optionPage: '扩展选项',
        repoPage: '源码下载',
        feedbackPage: '吐槽一下',
        guidePage: chromeBase.zh_CN.guidePage,
    },
    zh_TW: {
        add2Whitelist: '將{host}加入白名單',
        removeFromWhitelist: '將{host}從白名單移出',
        allFunctions: chromeBase.zh_TW.allFunction,
        optionPage: '擴充選項',
        repoPage: '源碼下載',
        feedbackPage: '吐槽一下',
        guidePage: chromeBase.zh_TW.guidePage,
    },
    en: {
        add2Whitelist: 'Add {host} to the whitelist',
        removeFromWhitelist: 'Remove {host} from the whitelist',
        allFunctions: chromeBase.en.allFunction,
        optionPage: 'Options',
        repoPage: 'Source Code',
        feedbackPage: 'Issues',
        guidePage: chromeBase.en.guidePage,
    },
    ja: {
        add2Whitelist: 'ホワイトリスト',
        removeFromWhitelist: 'ホワイトリストから削除する',
        allFunctions: chromeBase.ja.allFunction,
        optionPage: '拡張設定',
        repoPage: 'ソースコード',
        feedbackPage: 'フィードバックの欠如',
        guidePage: chromeBase.ja.guidePage,
    }
}

export default _default