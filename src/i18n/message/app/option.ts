/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type OptionMessage = {
    yes: string
    no: string
    popup: {
        title: string
        max: string
        defaultMergeDomain: string
        defaultDisplay: string
        displaySiteName: string
        durationWidth: string
        weekStart: string
        weekStartAsNormal: string
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
        }
        printInConsole: {
            label: string
            console: string
            info: string
        },
        darkMode: {
            label: string
            options: Record<timer.option.DarkMode, string>
        }
        limitFilterType: Record<timer.limit.FilterType, string> & {
            label: string
        }
    }
    statistics: {
        title: string
        countLocalFiles: string
        localFileTime: string
        localFilesInfo: string
        collectSiteName: string
        siteNameUsage: string
        siteName: string
    }
    backup: {
        title: string
        type: string
        client: string
        meta: {
            [type in timer.backup.Type]: {
                label: string
                auth?: string
                authInfo?: string
            }
        }
        alert: string
        test: string
        operation: string
        lastTimeTip: string
        auto: {
            label: string
            interval: string
        }
    }
    resetButton: string
    resetSuccess: string
    defaultValue: string
}

const FOLLOW_BROWSER: Record<timer.Locale, string> = {
    zh_CN: '跟随浏览器',
    zh_TW: '跟隨瀏覽器',
    en: 'Follow browser',
    ja: 'ブラウザと同じ',
}

const _default: Messages<OptionMessage> = {
    zh_CN: {
        yes: '是',
        no: '否',
        popup: {
            title: '弹窗页',
            max: '只显示前 {input} 条数据，剩下的条目合并显示',
            defaultMergeDomain: '{input} 打开时合并子域名',
            defaultDisplay: '打开时显示 {duration} {type}',
            displaySiteName: '{input}  显示时是否使用 {siteName} 来代替域名',
            durationWidth: '80px',
            weekStart: '每周的第一天 {input}',
            weekStartAsNormal: '按照惯例',
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
                label: '语言设置 {input}',
                default: '跟随浏览器',
                changeConfirm: '语言设置成功，请刷新页面！',
                reloadButton: '刷新',
            },
            printInConsole: {
                label: '{input}  是否在 {console} 里打印当前网站的 {info}',
                console: '浏览器的控制台',
                info: '今日访问信息',
            },
            darkMode: {
                label: '夜间模式 {input}',
                options: {
                    default: '跟随浏览器',
                    on: '始终开启',
                    off: '始终关闭',
                    timed: '定时开启',
                },
            },
            limitFilterType: {
                label: '每日时限的背景风格 {input}',
                translucent: '半透明',
                groundGlass: '毛玻璃',
            },
        },
        statistics: {
            title: '统计',
            countLocalFiles: '{input}  是否统计使用浏览器 {localFileTime} {info}',
            localFileTime: '阅读本地文件的时间',
            localFilesInfo: '支持 PDF、图片、txt 以及 json 等格式',
            collectSiteName: '{input}  访问网站主页时，是否自动收集 {siteName} {siteNameUsage}',
            siteName: '网站的名称',
            siteNameUsage: '数据只存放在本地，将代替域名用于展示，增加辨识度。当然您可以自定义每个网站的名称',
        },
        backup: {
            title: '数据备份',
            type: '远端类型 {input}',
            client: '客户端标识 {input}',
            meta: {
                none: {
                    label: '不开启备份',
                    auth: '',
                },
                gist: {
                    label: 'Github Gist',
                    auth: 'Personal Access Token {info} {input}',
                    authInfo: '需要创建一个至少包含 gist 权限的 token',
                },
            },
            alert: '这是一项实验性功能，如果有任何问题请联系作者~ (returnzhy1996@outlook.com)',
            test: '测试',
            lastTimeTip: '上次备份时间: {lastTime}',
            operation: '备份数据',
            auto: {
                label: '是否开启自动备份',
                interval: '每 {input} 分钟备份一次',
            },
        },
        resetButton: '恢复默认',
        resetSuccess: '成功重置为默认值',
        defaultValue: '默认值： {default}',
    },
    zh_TW: {
        yes: '是',
        no: '否',
        popup: {
            title: '彈窗頁',
            max: '隻顯示前 {input} 條數據，剩下的條目合並顯示',
            defaultMergeDomain: '{input} 打開時合併子域名',
            defaultDisplay: '打開時顯示 {duration} {type}',
            displaySiteName: '{input}  顯示時是否使用 {siteName} 來代替域名',
            durationWidth: '80px',
            weekStart: '每週的第一天 {input}',
            weekStartAsNormal: '按照慣例',
        },
        appearance: {
            title: '外觀',
            displayWhitelist: '{input}  是否在 {contextMenu} 裡，顯示 {whitelist} 相關功能',
            whitelistItem: '白名單',
            contextMenu: '瀏覽器的右鍵菜單',
            displayBadgeText: '{input}  是否在 {icon} 上，顯示 {timeInfo}',
            icon: '擴充圖標',
            badgeTextContent: '當前網站的今日瀏覽時長',
            locale: {
                label: '語言設置 {input}',
                default: '跟隨瀏覽器',
                changeConfirm: '語言設置成功，請刷新頁麵！',
                reloadButton: '刷新',
            },
            printInConsole: {
                label: '{input}  是否在 {console} 裡打印當前網站的 {info}',
                console: '瀏覽器控制台',
                info: '今日拜訪信息',
            },
            darkMode: {
                label: '黑暗模式 {input}',
                options: {
                    default: '跟隨瀏覽器',
                    on: '始終開啟',
                    off: '始終關閉',
                    timed: '定時開啟',
                },
            },
            limitFilterType: {
                label: '每日時限的背景風格 {input}',
                translucent: '半透明',
                groundGlass: '毛玻璃',
            },
        },
        statistics: {
            title: '統計',
            countLocalFiles: '{input}  是否統計使用瀏覽器 {localFileTime} {info}',
            localFileTime: '閱讀本地文件的時間',
            localFilesInfo: '支持 PDF、圖片、txt 以及 json 等格式',
            collectSiteName: '{input}  拜訪網站主頁時，是否自動收集 {siteName} {siteNameUsage}',
            siteName: '網站的名稱',
            siteNameUsage: '數據隻存放在本地，將代替域名用於展示，增加辨識度。當然您可以自定義每個網站的名稱',
        },
        backup: {
            title: '數據備份',
            type: '雲端類型 {input}',
            client: '客戶端標識 {input}',
            meta: {
                none: {
                    label: '關閉備份',
                },
                gist: {
                    label: 'Github Gist',
                    auth: 'Personal Access Token {info} {input}',
                    authInfo: '需要創建一個至少包含 gist 權限的 token',
                },
            },
            alert: '這是一項實驗性功能，如果有任何問題請聯繫作者 (returnzhy1996@outlook.com) ~',
            test: '測試',
            operation: '備份數據',
            lastTimeTip: '上次備份時間: {lastTime}',
            auto: {
                label: '是否開啟自動備份',
                interval: '每 {input} 分鐘備份一次',
            },
        },
        resetButton: '恢複默認',
        resetSuccess: '成功重置爲默認值',
        defaultValue: '默認值： {default}',
    },
    en: {
        yes: 'Yes',
        no: 'No',
        popup: {
            title: 'Popup Page',
            max: 'Show the first {input} data items',
            defaultMergeDomain: '{input} Whether to merge subdomains on open',
            defaultDisplay: 'Show {duration} {type} on open',
            displaySiteName: '{input}  Whether to display {siteName} instead of URL',
            durationWidth: '110px',
            weekStart: 'The first day for each week {input}',
            weekStartAsNormal: 'As Normal',
        },
        appearance: {
            title: 'Appearance',
            displayWhitelist: '{input}  Whether to display {whitelist} in {contextMenu}',
            whitelistItem: 'whitelist related shortcuts',
            contextMenu: 'the context menu',
            displayBadgeText: '{input}  Whether to display {timeInfo} in {icon}',
            icon: 'the icon of extension',
            badgeTextContent: 'the browsing time of current website',
            locale: {
                label: 'Language {input}',
                default: 'Follow browser',
                changeConfirm: 'The language has been changed successfully, please reload this page!',
                reloadButton: 'Reload',
            },
            printInConsole: {
                label: '{input}  Whether to print {info} in the {console}',
                console: 'console',
                info: 'the visit count of the current website today',
            },
            darkMode: {
                label: 'Dark mode {input}',
                options: {
                    default: 'Follow browser',
                    on: 'Always on',
                    off: 'Always off',
                    timed: 'Timed on',
                },
            },
            limitFilterType: {
                label: 'Background style for daily time limit {input}',
                translucent: 'Translucent',
                groundGlass: 'Ground Glass',
            },
        },
        statistics: {
            title: 'Statistics',
            countLocalFiles: '{input}  Whether to count the time to {localFileTime} {info} in the browser',
            localFileTime: ' read a local file ',
            localFilesInfo: 'Supports files of types such as PDF, image, txt and json',
            collectSiteName: '{input}  Whether to automatically collect {siteName} {siteNameUsage} when visiting the site homepage',
            siteName: ' the site name ',
            siteNameUsage: 'The data is only stored locally and will be displayed instead of the URL to increase the recognition.Of course, you can also customize the name of each site.',
        },
        backup: {
            title: 'Data Backup',
            type: 'Remote type {input}',
            client: 'Client name {input}',
            meta: {
                none: {
                    label: 'Always off',
                },
                gist: {
                    label: 'Github Gist',
                    auth: 'Personal Access Token {info} {input}',
                    authInfo: 'One token with at least gist permission is required',
                },
            },
            alert: 'This is an experimental feature, if you have any questions please contact the author via returnzhy1996@outlook.com~',
            test: 'Test',
            operation: 'Backup',
            lastTimeTip: 'Last backup time: {lastTime}',
            auto: {
                label: 'Whether to enable automatic backup',
                interval: 'and run every {input} minutes',
            },
        },
        resetButton: 'Reset',
        resetSuccess: 'Reset to default successfully!',
        defaultValue: 'Default: {default}',
    },
    ja: {
        yes: 'はい',
        no: 'いいえ',
        popup: {
            title: 'ポップアップページ',
            max: '最初の {input} 個のデータのみを表示し、残りのエントリは結合されます',
            defaultMergeDomain: '{input} オープン時にサブドメインをマージ',
            defaultDisplay: '開くと {duration} {type} が表示されます',
            displaySiteName: '{input}  ホストの代わりに {siteName} を表示するかどうか',
            durationWidth: '100px',
            weekStart: '週の最初の日 {input}',
            weekStartAsNormal: 'いつものように',
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
                label: '言語設定 {input}',
                default: 'ブラウザと同じ',
                changeConfirm: '言語が正常に変更されました。このページをリロードしてください。',
                reloadButton: 'リロード',
            },
            printInConsole: {
                label: '{input}  現在のウェブサイトの {info} を {console} に印刷するかどうか',
                console: 'コンソール',
                info: '今日の情報をご覧ください',
            },
            darkMode: {
                label: 'ダークモード {input}',
                options: {
                    default: 'ブラウザと同じ',
                    on: '常にオン',
                    off: '常にオフ',
                    timed: '時限スタート',
                },
            },
            limitFilterType: {
                label: '毎日の時間制限の背景スタイル {input}',
                translucent: '半透明',
                groundGlass: 'すりガラス',
            },
        },
        statistics: {
            title: '統計',
            countLocalFiles: '{input}  ブラウザで {localFileTime} {info} に費やされた時間をカウントするかどうか',
            localFileTime: ' ローカルファイルの読み取り ',
            localFilesInfo: 'PDF、画像、txt、jsonを含む',
            collectSiteName: '{input}  ウェブサイトのホームページにアクセスしたときにウェブサイトの名前を自動的に収集するかどうか',
            siteName: 'サイト名',
            siteNameUsage: 'データはローカルにのみ存在し、認識を高めるためにホストの代わりに表示に使用されます。もちろん、各Webサイトの名前をカスタマイズできます。',
        },
        backup: {
            title: 'データバックアップ',
            type: 'バックアップ方法 {input}',
            client: 'クライアント名 {input}',
            meta: {
                none: {
                    label: 'バックアップを有効にしない',
                },
                gist: {
                    label: 'Github Gist',
                    auth: 'Personal Access Token {info} {input}',
                    authInfo: '少なくとも gist 権限を持つトークンが 1 つ必要です',
                },
            },
            alert: 'これは実験的な機能です。質問がある場合は、作成者に連絡してください (returnzhy1996@outlook.com)',
            test: 'テスト',
            operation: 'バックアップ',
            lastTimeTip: '前回のバックアップ時間: {lastTime}',
            auto: {
                label: '自動バックアップを有効にするかどうか',
                interval: ' {input} 分ごとに実行',
            },
        },
        resetButton: 'リセット',
        resetSuccess: 'デフォルトに正常にリセット',
        defaultValue: 'デフォルト値：{default}',
    },
}

export default _default