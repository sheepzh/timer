/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"
import chromeBase from "@util/i18n/components/app"

export type LayoutMessage = {
    title: string
    menu: {
        profile: string
        usage: {
            title: string
            quickstart: string
            background: string
            advanced: string
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
        title: chromeBase.zh_CN.guidePage + ' | ' + chromeBase.zh_CN.name,
        menu: {
            profile: '欢迎安装' + chromeBase.zh_CN.name,
            usage: {
                title: '如何使用',
                quickstart: '快速开始',
                background: '访问后台页面',
                advanced: '高级功能',
            },
            privacy: {
                title: '隐私声明',
                scope: '收集哪些数据',
                storage: '如何处理这些数据',
            }
        },
    },
    zh_TW: {
        title: chromeBase.zh_TW.guidePage + ' | ' + chromeBase.zh_TW.name,
        menu: {
            profile: '歡迎安裝' + chromeBase.zh_TW.name,
            usage: {
                title: '如何使用',
                quickstart: '快速開始',
                background: '訪問後台頁面',
                advanced: '高級功能',
            },
            privacy: {
                title: '隱私聲明',
                scope: '收集哪些數據',
                storage: '如何處理這些數據',
            },
        },
    },
    en: {
        title: chromeBase.en.guidePage + ' | ' + chromeBase.en.name,
        menu: {
            profile: 'Welcome to install ' + chromeBase.en.name,
            usage: {
                title: 'Using Timer',
                quickstart: 'Quickstart',
                background: 'Using all functions',
                advanced: 'Advanced features'
            },
            privacy: {
                title: 'Privary Policy',
                scope: 'Personal data collected',
                storage: 'How to do with this data',
            }
        }
    },
    ja: {
        title: chromeBase.ja.guidePage + ' | ' + chromeBase.ja.name,
        menu: {
            profile: chromeBase.ja.name + 'へようこそ',
            usage: {
                title: '使い方',
                quickstart: 'クイックスタート',
                background: 'すべての機能',
                advanced: '高度な機能',
            },
            privacy: {
                title: 'ポリシーと規約',
                scope: '収集する情報',
                storage: 'このデータをどうするか',
            }
        }
    }
}

export default _default