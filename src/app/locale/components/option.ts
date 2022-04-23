/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"
import popupDurationMessages, { PopupDurationMessage } from "@util/i18n/components/popup-duration"

export type OptionMessage = {
    yes: string
    no: string
    popup: {
        title: string
        max: string
        defaultDisplay: string
        displaySiteName: string
        duration: PopupDurationMessage
        durationWidth: string
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
        locale: {
            label: string
            default: string
            changeConfirm: string
            reloadButton: string
            infoL1: string
            infoL2: string
        }
        printInConsole: string
    }
    statistics: {
        title: string
        countWhenIdle: string
        idleTime: string
        idleTimeInfo: string
        countLocalFiles: string
        localFileTime: string
        localFilesInfo: string
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
            defaultDisplay: "打开时显示 {duration} {type}",
            displaySiteName: '{input}  显示时是否使用 {siteName} 来代替域名',
            duration: popupDurationMessages.zh_CN,
            durationWidth: "80px"
        },
        appearance: {
            title: '外观',
            displayWhitelist: '{input}  是否在 {contextMenu} 里，显示 {whitelist} 相关功能',
            whitelistItem: '白名单',
            contextMenu: '浏览器的右键菜单',
            displayBadgeText: '{input}  是否在 {icon} 上，显示 {timeInfo}',
            icon: '扩展图标',
            badgeTextContent: '当前网站的今日浏览时长',
            locale: {
                label: "语言设置 {info}  {input}",
                infoL1: "由于源码的结构缺陷，语言设置功能目前只对功能页有效，今日数据弹窗页的语言设置始终跟随浏览器。",
                infoL2: "作者将在后续版本中重构代码，实现弹窗页的语言切换功能，谢谢您的包涵！❤️❤️",
                default: "跟随浏览器",
                changeConfirm: "语言设置成功，请刷新页面！",
                reloadButton: "刷新"
            },
            printInConsole: '{input}  是否在浏览器的控制台里打印当前网站的今日访问信息'
        },
        statistics: {
            title: '统计',
            countWhenIdle: '{input}  是否统计 {idleTime} {info}',
            idleTime: '休眠时间',
            idleTimeInfo: '长时间不操作（比如全屏观看视频），浏览器会自动进入休眠状态',
            countLocalFiles: '{input}  是否统计使用浏览器 {localFileTime} {info}',
            localFileTime: '阅读本地文件的时间',
            localFilesInfo: '支持 PDF、图片、txt 以及 json 等格式',
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
            defaultDisplay: "Show {duration} {type} when opened",
            displaySiteName: '{input}  Whether to display {siteName} instead of host',
            duration: popupDurationMessages.en,
            durationWidth: "110px"
        },
        appearance: {
            title: 'Appearance',
            displayWhitelist: '{input}  Whether to display {whitelist} in {contextMenu}',
            whitelistItem: 'the whitelist item',
            contextMenu: 'the context menu',
            displayBadgeText: '{input}  Whether to display {timeInfo} in {icon}',
            icon: 'the icon of extension',
            badgeTextContent: 'the browse time of current website',
            locale: {
                label: "Language {info} {input}",
                infoL1: "Due to the structural defects of the source code, the language setting function is currently only valid for this page. The language setting of today's data popup page is always the same as the browser.",
                infoL2: "I will refactor the code in subsequent versions to realize the language switching of the popup page. Thank you for your patience! ❤️❤️",
                default: "Same as browser",
                changeConfirm: "The language has been changed successfully, please reload this page!",
                reloadButton: "Reload"
            },
            printInConsole: '{input}  Whether to print the visit count of the current website today in the console'
        },
        statistics: {
            title: 'Statistics',
            countWhenIdle: '{input}  Whether to count {idleTime} {info}',
            idleTime: 'idle time',
            idleTimeInfo: 'If you do not operate for a long time (such as watching a video in full screen), the browser will automatically enter the idle state',
            countLocalFiles: '{input}  Whether to count the time spent {localFileTime} {info} in the browser',
            localFileTime: ' reading the local file ',
            localFilesInfo: 'Including PDF, image, txt and json',
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
            defaultDisplay: "開くと {duration} {type} が表示されます",
            // Not translated
            displaySiteName: '{input}  ホストの代わりに {siteName} を表示するかどうか',
            duration: popupDurationMessages.ja,
            durationWidth: "100px"
        },
        appearance: {
            title: '外観',
            // Not translated
            displayWhitelist: '{input}  {contextMenu} に {whitelist} を表示するかどうか',
            whitelistItem: 'ホワイトリスト機能',
            contextMenu: 'コンテキストメニュー',
            displayBadgeText: '{input}  {icon} に {timeInfo} を表示するかどうか',
            icon: '拡張機能のアイコン',
            badgeTextContent: '現在のウェブサイトの閲覧時間',
            locale: {
                label: "言語設定 {info} {input}",
                default: "ブラウザと同じ",
                infoL1: "ソースコードの構造上の欠陥により、言語設定機能は現在このページでのみ有効です。今日のデータポップアップページの言語設定は常にブラウザと同じです。",
                infoL2: "ポップアップページの言語切り替えを実現するために、以降のバージョンでコードをリファクタリングします。もうしばらくお待ちください。❤️❤️",
                changeConfirm: "言語が正常に変更されました。このページをリロードしてください。",
                reloadButton: "リロード"
            },
            printInConsole: '{input}  現在のWebサイトへのアクセス数をコンソールに印刷するかどうか'
        },
        statistics: {
            title: '統計',
            countWhenIdle: '{input}  {idleTime} をカウントするかどうか {info}',
            idleTime: 'アイドルタイム',
            idleTimeInfo: '長時間操作しない場合（フルスクリーンでビデオを見るなど）、ブラウザは自動的にアイドル状態になります',
            countLocalFiles: '{input}  ブラウザで {localFileTime} {info} に費やされた時間をカウントするかどうか',
            localFileTime: ' ローカルファイルの読み取り ',
            localFilesInfo: 'PDF、画像、txt、jsonを含む',
            collectSiteName: '{input}  ウェブサイトのホームページにアクセスしたときにウェブサイトの名前を自動的に収集するかどうか',
            siteName: 'サイト名',
            siteNameUsage: 'データはローカルにのみ存在し、認識を高めるためにホストの代わりに表示に使用されます。'
                + 'もちろん、各Webサイトの名前をカスタマイズできます。'
        },
        resetButton: 'リセット',
        resetSuccess: 'デフォルトに正常にリセット',
        defaultValue: 'デフォルト値：{default}'
    }
}

export default _default