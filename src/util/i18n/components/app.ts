/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Messages } from ".."

export type AppMessage = {
    name: string
    marketName: string
    description: string
    currentVersion: string
    allFunction: string
    guidePage: string
}

/**
 * Use for chrome
 */
const _default: Messages<AppMessage> = {
    en: {
        name: 'Timer',
        marketName: 'Timer - Running & Browsing Time & Visit count',
        description: 'To be the BEST web timer.',
        currentVersion: 'Version: {version}',
        allFunction: 'All Functions',
        guidePage: 'User Manual',
    },
    zh_CN: {
        name: '网费很贵',
        marketName: '网费很贵 - 上网时间统计',
        description: '做最好用的上网时间统计工具。',
        currentVersion: '版本: v{version}',
        allFunction: '所有功能',
        guidePage: '用户手册',
    },
    zh_TW: {
        name: '網費很貴',
        marketName: '網費很貴 - 上網時間統計',
        description: '做最好用的上網時間統計工具。',
        currentVersion: '版本: v{version}',
        allFunction: '所有功能',
        guidePage: '用戶手冊',
    },
    ja: {
        name: 'Web時間統計',
        marketName: 'Web時間統計',
        description: '最高のオンライン時間統計ツールを作成します。',
        currentVersion: 'バージョン: v{version}',
        allFunction: 'すべての機能',
        guidePage: 'ユーザーマニュアル',
    }
}

export default _default