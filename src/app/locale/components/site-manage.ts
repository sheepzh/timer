/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"

export type SiteManageMessage = {
    hostPlaceholder: string
    aliasPlaceholder: string
    onlyDetected: string
    deleteConfirmMsg: string
    column: {
        host: string
        alias: string
        aliasInfo: string
        source: string
    }
    source: {
        user: string
        detected: string
    }
    button: {
        add: string
        delete: string
        modify: string
        save: string
    }
    form: {
        emptyAlias: string
        emptyHost: string
    }
    msg: {
        hostExistWarn: string
        saved: string
        existedTag: string
    }
}

const en: SiteManageMessage = {
    hostPlaceholder: "Partial URL, then enter",
    aliasPlaceholder: "Partial name, then enter",
    onlyDetected: 'Only detected',
    deleteConfirmMsg: 'The name of {host} will be deleted',
    column: {
        host: "Site URL",
        alias: "Site Name",
        aliasInfo: "The site name will be shown on the record page and the popup page",
        source: "Source"
    },
    source: {
        user: 'user-maintained',
        detected: 'auto-detected'
    },
    button: {
        add: 'New',
        delete: 'Delete',
        modify: 'Modify',
        save: 'Save',
    },
    form: {
        emptyAlias: 'Please enter site name',
        emptyHost: 'Please enter site URL'
    },
    msg: {
        hostExistWarn: '{host} exists',
        saved: 'Saved',
        existedTag: 'EXISTED'
    }
}

const ja: SiteManageMessage = {
    hostPlaceholder: "ドメイン名で検索",
    aliasPlaceholder: "サイト名で検索",
    onlyDetected: '検出されただけ',
    deleteConfirmMsg: '{host} の名前が削除されます',
    column: {
        host: "サイトのURL",
        alias: "サイト名",
        aliasInfo: "サイト名はレコードページとポップアップページに表示されます",
        source: "ソース"
    },
    source: {
        user: '手动输入',
        detected: 'システム検出'
    },
    button: {
        add: '追加',
        delete: '削除',
        modify: '変更',
        save: '保存',
    },
    form: {
        emptyAlias: 'サイト名を入力してください',
        emptyHost: 'ドメイン名を入力してください'
    },
    msg: {
        hostExistWarn: '{host} が存在します',
        saved: '保存しました',
        existedTag: '既存'
    }
}

const messages: Messages<SiteManageMessage> = {
    zh_CN: {
        hostPlaceholder: "请输入域名，然后回车",
        aliasPlaceholder: "请输入网站名，然后回车",
        onlyDetected: '只看自动抓取',
        deleteConfirmMsg: '{host} 的名称设置将会被删除',
        column: {
            host: "网站域名",
            alias: "网站名称",
            aliasInfo: "网站名称会在报表以及今日数据（需要在扩展选项里设置）里展示，方便您快速识别域名",
            source: "来源"
        },
        source: {
            user: '手动设置',
            detected: '自动抓取'
        },
        button: {
            add: '新增',
            delete: '删除',
            modify: '修改',
            save: '保存'
        },
        form: {
            emptyAlias: '请输入网站名称',
            emptyHost: '请输入网站域名'
        },
        msg: {
            hostExistWarn: '{host} 已经存在',
            saved: '已保存',
            existedTag: '已存在'
        }
    },
    zh_TW: {
        hostPlaceholder: "請輸入網域，然後回車",
        aliasPlaceholder: "請輸入網站名，然後回車",
        onlyDetected: '隻看自動抓取',
        deleteConfirmMsg: '{host} 的名稱設置將會被刪除',
        column: {
            host: "網站域名",
            alias: "網站名稱",
            aliasInfo: "網站名稱會在報表以及今日數據（需要在擴展選項裡設置）裡展示，方便您快速識別網域",
            source: "來源"
        },
        source: {
            user: '手動設置',
            detected: '自動抓取'
        },
        button: {
            add: '新增',
            delete: '刪除',
            modify: '修改',
            save: '保存'
        },
        form: {
            emptyAlias: '請輸入網站名稱',
            emptyHost: '請輸入網站域名'
        },
        msg: {
            hostExistWarn: '{host} 已經存在',
            saved: '已保存',
            existedTag: '已存在'
        }
    },
    en,
    // Feedback
    ja
}

export default messages
