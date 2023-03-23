/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type LayoutMessage = {
    menu: {
        profile: string
        usage: {
            title: string
            quickstart: string
            background: string
            advanced: string
            backup: string
        }
        privacy: {
            title: string
            scope: string
            storage: string
        }
    }
}

const _default: Messages<LayoutMessage> = {
    zh_CN: {
        menu: {
            profile: '欢迎安装{appName}',
            usage: {
                title: '如何使用',
                quickstart: '快速开始',
                background: '访问后台页面',
                advanced: '高级功能',
                backup: '使用 Gist 备份数据',
            },
            privacy: {
                title: '隐私声明',
                scope: '收集哪些数据',
                storage: '如何处理这些数据',
            },
        },
    },
    zh_TW: {
        menu: {
            profile: '歡迎安裝{appName}',
            usage: {
                title: '如何使用',
                quickstart: '快速開始',
                background: '訪問後台頁面',
                advanced: '高級功能',
                backup: '使用 Gist 備份數據',
            },
            privacy: {
                title: '隱私聲明',
                scope: '收集哪些數據',
                storage: '如何處理這些數據',
            },
        },
    },
    en: {
        menu: {
            profile: 'Welcome to install {appName}',
            usage: {
                title: 'Using Timer',
                quickstart: 'Quickstart',
                background: 'Using all functions',
                advanced: 'Advanced features',
                backup: 'Backup your data with Gist',
            },
            privacy: {
                title: 'Privary Policy',
                scope: 'Personal data collected',
                storage: 'How to do with this data',
            },
        },
    },
    ja: {
        menu: {
            profile: '{appName}へようこそ',
            usage: {
                title: '使い方',
                quickstart: 'クイックスタート',
                background: 'すべての機能',
                advanced: '高度な機能',
                backup: 'Gist でデータをバックアップ',
            },
            privacy: {
                title: 'ポリシーと規約',
                scope: '収集する情報',
                storage: 'このデータをどうするか',
            },
        },
    },
}

export default _default