/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type SiteManageMessage = {
    hostPlaceholder: string
    aliasPlaceholder: string
    onlyDetected: string
    deleteConfirmMsg: string
    column: {
        host: string
        type: string
        alias: string
        aliasInfo: string
        source: string
        icon: string
    }
    type: Record<'normal' | 'merged' | 'virtual', Record<'name' | 'info', string>>
    source: {
        user: string
        detected: string
    }
    button: {
        add: string
        delete: string
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
        mergedTag: string
        virtualTag: string
    }
}

const _default: Messages<SiteManageMessage> = {
    zh_CN: {
        hostPlaceholder: '请输入域名，然后回车',
        aliasPlaceholder: '请输入网站名，然后回车',
        onlyDetected: '只看自动抓取',
        deleteConfirmMsg: '{host} 的名称设置将会被删除',
        column: {
            host: '网站域名',
            type: '网站类型',
            alias: '网站名称',
            aliasInfo: '网站名称会在报表以及今日数据（需要在扩展选项里设置）里展示，方便您快速识别域名',
            source: '名称来源',
            icon: '网站图标',
        },
        type: {
            normal: {
                name: '普通站点',
                info: '按域名的维度统计',
            },
            merged: {
                name: '合并站点',
                info: '将多个相关的域名合并统计，合并规则可以自定义',
            },
            virtual: {
                name: '自定义站点',
                info: '统计 Ant Pattern 格式的任意 URL，可以在右上角新增自定义站点',
            },
        },
        source: {
            user: '手动设置',
            detected: '自动抓取',
        },
        button: {
            add: '新增',
            delete: '删除',
            save: '保存',
        },
        form: {
            emptyAlias: '请输入网站名称',
            emptyHost: '请输入网站域名',
        },
        msg: {
            hostExistWarn: '{host} 已经存在',
            saved: '已保存',
            existedTag: '已存在',
            mergedTag: '合并',
            virtualTag: '自定义',
        },
    },
    zh_TW: {
        hostPlaceholder: '請輸入網域，然後回車',
        aliasPlaceholder: '請輸入網站名，然後回車',
        onlyDetected: '隻看自動抓取',
        deleteConfirmMsg: '{host} 的名稱設置將會被刪除',
        column: {
            host: '網站域名',
            type: '網站類型',
            alias: '網站名稱',
            aliasInfo: '網站名稱會在報表以及今日數據（需要在擴充選項裡設置）裡展示，方便您快速識別網域',
            source: '名稱來源',
            icon: '網站圖標',
        },
        source: {
            user: '手動設置',
            detected: '自動抓取',
        },
        type: {
            normal: {
                name: '普通站點',
                info: '按域名的維度統計',
            },
            merged: {
                name: '合併站點',
                info: '將多個相關的域名合併統計，合併規則可以自定義',
            },
            virtual: {
                name: '自定義站點',
                info: '統計 Ant Pattern 格式的任意 URL，可以在右上角新增自定義站點',
            },
        },
        button: {
            add: '新增',
            delete: '刪除',
            save: '保存',
        },
        form: {
            emptyAlias: '請輸入網站名稱',
            emptyHost: '請輸入網站域名',
        },
        msg: {
            hostExistWarn: '{host} 已經存在',
            saved: '已保存',
            existedTag: '已存在',
            mergedTag: '合並',
        },
    },
    en: {
        hostPlaceholder: 'Partial URL, then enter',
        aliasPlaceholder: 'Partial name, then enter',
        onlyDetected: 'Only detected',
        deleteConfirmMsg: 'The name of {host} will be deleted',
        column: {
            host: 'Site URL',
            type: 'Site Type',
            alias: 'Site Name',
            aliasInfo: 'The site name will be shown on the record page and the popup page',
            source: 'Name Source',
            icon: 'Icon',
        },
        type: {
            normal: {
                name: 'normal',
                info: 'statistics by domain name',
            },
            merged: {
                name: 'merged',
                info: 'merge statistics of multiple related domain names, and the merge rules can be customized',
            },
            virtual: {
                name: 'virtual',
                info: 'count any URL in Ant Pattern format, you can add a custom site in the upper right corner',
            },
        },
        source: {
            user: 'user-maintained',
            detected: 'auto-detected',
        },
        button: {
            add: 'New',
            delete: 'Delete',
            save: 'Save',
        },
        form: {
            emptyAlias: 'Please enter site name',
            emptyHost: 'Please enter site URL',
        },
        msg: {
            hostExistWarn: '{host} exists',
            saved: 'Saved',
            existedTag: 'EXISTED',
            mergedTag: 'MERGED',
            virtualTag: 'VIRTUAL',
        },
    },
    ja: {
        hostPlaceholder: 'ドメイン名で検索',
        aliasPlaceholder: 'サイト名で検索',
        onlyDetected: '検出されただけ',
        deleteConfirmMsg: '{host} の名前が削除されます',
        column: {
            host: 'サイトのURL',
            alias: 'サイト名',
            aliasInfo: 'サイト名はレコードページとポップアップページに表示されます',
            source: 'ソース',
            type: 'サイト種別',
            icon: 'Icon',
        },
        source: {
            user: '手动输入',
            detected: 'システム検出',
        },
        button: {
            add: '追加',
            delete: '削除',
            save: '保存',
        },
        form: {
            emptyAlias: 'サイト名を入力してください',
            emptyHost: 'ドメイン名を入力してください',
        },
        msg: {
            hostExistWarn: '{host} が存在します',
            saved: '保存しました',
            existedTag: '既存',
            mergedTag: '合并',
            virtualTag: 'バーチャル',
        },
        type: {
            normal: {
                name: '普通',
                info: 'ドメイン名による統計',
            },
            merged: {
                name: '合并',
                info: '複数の関連するドメイン名のマージ統計をカスタマイズできます',
            },
            virtual: {
                name: 'バーチャル',
                info: 'Ant Pattern 形式の任意の URL をカウントします。右上隅にカスタムサイトを追加できます',
            },
        },
    },
}

export default _default
