/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "../../../util/i18n"

export type OptionMessage = {
    yes: string
    no: string
    popup: {
        title: string
        max: string
        type: string
        displaySiteName: string
    }
    appearance: {
        title: string
        // whitelist
        displayWhitelist: string
        whitelistItem: string
        contextMenu: string
        // badge text
        displayBadgeText: string
        icon: string
        badgeTextContent: string
    }
    statistics: {
        title: string
        countWhenIdle: string
        idleTime: string
        idleTimeInfo: string
        collectSiteName: string
        siteNameUsage: string
        siteName: string
    }
    resetButton: string
    resetSuccess: string
    defaultValue: string
}

const _default: Messages<OptionMessage> = {
    zh_CN: {
        yes: '是',
        no: '否',
        popup: {
            title: '今日数据',
            max: '只显示前 {input} 条今日数据，剩下的条目合并显示',
            type: '打开时显示 {input}',
            displaySiteName: '{input}  显示时是否使用 {siteName} 来代替域名'
        },
        appearance: {
            title: '外观',
            displayWhitelist: '{input}  是否在 {contextMenu} 里，显示 {whitelist} 相关功能',
            whitelistItem: '白名单',
            contextMenu: '浏览器的右键菜单',
            displayBadgeText: '{input}  是否在 {icon} 上，显示 {timeInfo}',
            icon: '扩展图标',
            badgeTextContent: '当前网站的今日浏览时长'
        },
        statistics: {
            title: '统计',
            countWhenIdle: '{input}  是否统计 {idleTime} {info}',
            idleTime: '休眠时间',
            idleTimeInfo: '长时间不操作（比如全屏观看视频），浏览器会自动进入休眠状态',
            collectSiteName: '{input}  访问网站主页时，是否自动收集 {siteName} {siteNameUsage}',
            siteName: '网站的名称',
            siteNameUsage: '数据只存放在本地，将代替域名用于展示，增加辨识度。当然您可以自定义每个网站的名称'
        },
        resetButton: '恢复默认',
        resetSuccess: '成功重置为默认值',
        defaultValue: '默认值： {default}'
    },
    en: {
        yes: 'Yes',
        no: 'No',
        popup: {
            title: 'Today\'s Data',
            max: 'Show the first {input} data items of today',
            type: 'Show {input} when opened',
            displaySiteName: '{input}  Whether to display {siteName} instead of host'
        },
        appearance: {
            title: 'Appearance',
            displayWhitelist: '{input}  Whether to display {whitelist} in {contextMenu}',
            whitelistItem: 'the whitelist item',
            contextMenu: 'the context menu',
            displayBadgeText: '{input}  Whether to display {timeInfo} in {icon}',
            icon: 'the icon of extension',
            badgeTextContent: 'the browse time of current website'
        },
        statistics: {
            title: 'Statistics',
            countWhenIdle: '{input}  Whether to count {idleTime} {info}',
            idleTime: 'idle time',
            idleTimeInfo: 'If you do not operate for a long time (such as watching a video in full screen), the browser will automatically enter the idle state',
            collectSiteName: '{input}  Whether to automatically collect the name of the website when visiting the homepage of the website',
            siteName: 'Site Name',
            siteNameUsage: 'The data only exists locally and will be used for display instead of the host to increase recognition.'
                + 'Of course you can customize the name of each website.'
        },
        resetButton: 'Reset',
        resetSuccess: 'Reset to default successfully!',
        defaultValue: 'Default: {default}'
    },
    ja: {
        yes: 'はい',
        no: 'いいえ',
        popup: {
            title: '今日のデータ',
            max: '今日のデータは、最初の {input} データを示しています',
            type: '開くと {input} が表示されます',
            // Not translated
            displaySiteName: '{input}  Whether to display {siteName} instead of host'
        },
        appearance: {
            title: '外観',
            // Not translated
            displayWhitelist: '{input}  Whether to display {whitelist} in {contextMenu}',
            whitelistItem: 'the whitelist item',
            contextMenu: 'the context menu',
            displayBadgeText: '{input}  Whether to display {timeInfo} in {icon}',
            icon: 'the icon of extension',
            badgeTextContent: 'the browse time of current website'
        },
        statistics: {
            title: '統計',
            countWhenIdle: '{input}  Whether to count {idleTime} {info}',
            idleTime: 'idle time',
            idleTimeInfo: 'If you do not operate for a long time (such as watching a video in full screen), the browser will automatically enter the idle state',
            collectSiteName: '{input}  Whether to automatically collect the name of the website when visiting the homepage of the website',
            siteName: 'site name',
            siteNameUsage: 'The data only exists locally and will be used for display instead of the host to increase recognition.'
                + 'Of course you can customize the name of each website.'
        },
        resetButton: 'リセット',
        resetSuccess: 'デフォルトに正常にリセット',
        defaultValue: 'デフォルト値：{default}'
    }
}

export default _default