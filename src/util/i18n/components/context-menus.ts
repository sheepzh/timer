/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from ".."

/**
 * Used for menu
 */
export type ContextMenusMessage = {
    add2Whitelist: string
    removeFromWhitelist: string
    allFunctions: string
    optionPage: string
    repoPage: string
}

const _default: Messages<ContextMenusMessage> = {
    zh_CN: {
        add2Whitelist: '将{host}加入白名单',
        removeFromWhitelist: '将{host}从白名单移出',
        allFunctions: '全部功能',
        optionPage: '扩展选项',
        repoPage: '扩展源码'
    },
    en: {
        add2Whitelist: 'Add {host} to the whitelist',
        removeFromWhitelist: 'Remove {host} from the whitelist',
        allFunctions: 'All Functions',
        optionPage: 'Options',
        repoPage: 'Source Code'
    },
    ja: {
        add2Whitelist: 'ホワイトリスト',
        removeFromWhitelist: 'ホワイトリストから削除する',
        allFunctions: 'すべての機能',
        optionPage: '拡張設定',
        repoPage: 'ソースコード'
    }
}

export default _default