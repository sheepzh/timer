/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Used for menu
 */
export type ContextMenusMessage = {
    add2Whitelist: string
    removeFromWhitelist: string
    optionPage: string
    repoPage: string
    feedbackPage: string
}

const _default: Messages<ContextMenusMessage> = {
    zh_CN: {
        add2Whitelist: '将{host}加入白名单',
        removeFromWhitelist: '将{host}从白名单移出',
        optionPage: '扩展选项',
        repoPage: '源码下载',
        feedbackPage: '吐槽一下',
    },
    zh_TW: {
        add2Whitelist: '將{host}加入白名單',
        removeFromWhitelist: '將{host}從白名單移出',
        optionPage: '擴充選項',
        repoPage: '源碼下載',
        feedbackPage: '吐槽一下',
    },
    en: {
        add2Whitelist: 'Add {host} to the whitelist',
        removeFromWhitelist: 'Remove {host} from the whitelist',
        optionPage: 'Options',
        repoPage: 'Source Code',
        feedbackPage: 'Issues',
    },
    ja: {
        add2Whitelist: 'ホワイトリスト',
        removeFromWhitelist: 'ホワイトリストから削除する',
        optionPage: '拡張設定',
        repoPage: 'ソースコード',
        feedbackPage: 'フィードバックの欠如',
    },
}

export default _default