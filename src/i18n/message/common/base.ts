/**
 * Copyright (c) 2021-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type BaseMessage = {
    currentVersion: string
    allFunction: string
    guidePage: string
}

/**
 * Use for chrome
 */
const _default: Messages<BaseMessage> = {
    en: {
        currentVersion: 'Version: {version}',
        allFunction: 'All Functions',
        guidePage: 'User Manual',
    },
    zh_CN: {
        currentVersion: '版本: v{version}',
        allFunction: '所有功能',
        guidePage: '用户手册',
    },
    zh_TW: {
        currentVersion: '版本: v{version}',
        allFunction: '所有功能',
        guidePage: '使用者手冊',
    },
    ja: {
        currentVersion: 'バージョン: v{version}',
        allFunction: 'すべての機能',
        guidePage: 'ユーザーマニュアル',
    },
}

export default _default