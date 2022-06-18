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
        printInConsole: {
            label: string
            console: string
            info: string
        },
        darkMode: {
            label: string
            options: {
                on: string
                off: string
                timed: string
            }
            info: string
        }
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
            max: '只显示前 {input} 条数据，剩下的条目合并显示',
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
            printInConsole: {
                label: '{input}  是否在 {console} 里打印当前网站的 {info}',
                console: '浏览器的控制台',
                info: '今日访问信息'
            },
            darkMode: {
                label: "夜间模式 {info}  {input}",
                options: {
                    on: "始终开启",
                    off: "始终关闭",
                    timed: "定时开启"
                },
                info: "设置完成需刷新界面才会生效！"
            }
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
    zh_TW: {
        yes: '是',
        no: '否',
        popup: {
            title: '今日數據',
            max: '隻顯示前 {input} 條數據，剩下的條目合並顯示',
            defaultDisplay: "打開時顯示 {duration} {type}",
            displaySiteName: '{input}  顯示時是否使用 {siteName} 來代替域名',
            duration: popupDurationMessages.zh_CN,
            durationWidth: "80px"
        },
        appearance: {
            title: '外觀',
            displayWhitelist: '{input}  是否在 {contextMenu} 裡，顯示 {whitelist} 相關功能',
            whitelistItem: '白名單',
            contextMenu: '瀏覽器的右鍵菜單',
            displayBadgeText: '{input}  是否在 {icon} 上，顯示 {timeInfo}',
            icon: '擴展圖標',
            badgeTextContent: '當前網站的今日瀏覽時長',
            locale: {
                label: "語言設置 {info}  {input}",
                infoL1: "由於源碼的結構缺陷，語言設置功能目前隻對功能頁有效，今日數據彈窗頁的語言設置始終跟隨瀏覽器。",
                infoL2: "作者將在後續版本中重構代碼，實現彈窗頁的語言切換功能，謝謝您的包涵！❤️❤️",
                default: "跟隨瀏覽器",
                changeConfirm: "語言設置成功，請刷新頁麵！",
                reloadButton: "刷新"
            },
            printInConsole: {
                label: '{input}  是否在 {console} 裡打印當前網站的 {info}',
                console: '瀏覽器的控製颱',
                info: '今日訪問信息'
            },
            darkMode: {
                label: "夜間模式 {info}  {input}",
                options: {
                    on: "始終開啟",
                    off: "始終關閉",
                    timed: "定時開啟"
                },
                info: "設置完成需刷新界面才會生效！"
            }
        },
        statistics: {
            title: '統計',
            countWhenIdle: '{input}  是否統計 {idleTime} {info}',
            idleTime: '休眠時間',
            idleTimeInfo: '長時間不操作（比如全屏觀看視頻），瀏覽器會自動進入休眠狀態',
            countLocalFiles: '{input}  是否統計使用瀏覽器 {localFileTime} {info}',
            localFileTime: '閱讀本地文件的時間',
            localFilesInfo: '支持 PDF、圖片、txt 以及 json 等格式',
            collectSiteName: '{input}  訪問網站主頁時，是否自動收集 {siteName} {siteNameUsage}',
            siteName: '網站的名稱',
            siteNameUsage: '數據隻存放在本地，將代替域名用於展示，增加辨識度。當然您可以自定義每個網站的名稱'
        },
        resetButton: '恢複默認',
        resetSuccess: '成功重置爲默認值',
        defaultValue: '默認值： {default}'
    },
    en: {
        yes: 'Yes',
        no: 'No',
        popup: {
            title: 'Today\'s Data',
            max: 'Show the first {input} data items',
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
            printInConsole: {
                label: '{input}  Whether to print {info} in the {console}',
                console: 'console',
                info: 'the visit count of the current website today'
            },
            darkMode: {
                label: "Dark mode {info}  {input}",
                options: {
                    on: "Always on",
                    off: "Always off",
                    timed: "Timed on"
                },
                info: "After the setting is completed, you need to refresh the interface to take effect!",
            }
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
            max: '最初の {input} 個のデータのみを表示し、残りのエントリは結合されます',
            defaultDisplay: "開くと {duration} {type} が表示されます",
            displaySiteName: '{input}  ホストの代わりに {siteName} を表示するかどうか',
            duration: popupDurationMessages.ja,
            durationWidth: "100px"
        },
        appearance: {
            title: '外観',
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
            printInConsole: {
                label: '{input}  現在のウェブサイトの {info} を {console} に印刷するかどうか',
                console: 'コンソール',
                info: '今日の情報をご覧ください'
            },
            darkMode: {
                label: "ダークモード {info}  {input}",
                options: {
                    on: "常にオン",
                    off: "常にオフ",
                    timed: "時限スタート"
                },
                info: "設定が完了したら、インターフェースを更新して有効にする必要があります。",
            },
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