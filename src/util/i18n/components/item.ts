/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from ".."

export type ItemMessage = {
    date: string
    host: string
    total: string
    focus: string
    time: string
    operation: {
        label: string
        delete: string
        add2Whitelist: string
        removeFromWhitelist: string
        archive: string
        deleteConfirmMsgAll: string
        deleteConfirmMsgRange: string
        deleteConfirmMsg: string
        jumpToTrend: string
        exportWholeData: string
        importWholeData: string
    }
}

const _default: Messages<ItemMessage> = {
    zh_CN: {
        date: '日期',
        host: '域名',
        total: '运行时长',
        focus: '浏览时长',
        time: '打开次数',
        operation: {
            label: '操作',
            delete: '删除',
            add2Whitelist: '白名单',
            removeFromWhitelist: '启用',
            archive: '归档',
            jumpToTrend: '趋势',
            deleteConfirmMsgAll: '{url} 的所有访问记录将被删除',
            deleteConfirmMsgRange: '{url} 在 {start} 到 {end} 的访问记录将被删除',
            deleteConfirmMsg: '{url} 在 {date} 的访问记录将被删除',
            exportWholeData: '导出数据',
            importWholeData: '导入数据'
        }
    },
    en: {
        date: 'Date',
        host: 'Website',
        total: 'Running time',
        focus: 'Browsing Time',
        time: 'Visits',
        operation: {
            label: 'Operations',
            delete: 'Delete',
            add2Whitelist: 'Whitelist',
            removeFromWhitelist: 'Enable',
            archive: 'Archive',
            jumpToTrend: 'Trend',
            deleteConfirmMsgAll: 'All all records on {url} will be deleted!',
            deleteConfirmMsgRange: 'All the Records on {url} from {start} to {end} will be deleted!',
            deleteConfirmMsg: 'The record on {url} on {date} will be deleted!',
            exportWholeData: 'Export Data',
            importWholeData: 'Import Data'
        }
    },
    ja: {
        date: '日期',
        host: 'URL',
        total: '実行時間',
        focus: '閲覧時間',
        time: '訪問回数',
        operation: {
            label: '操作',
            delete: '削除',
            add2Whitelist: 'ホワイトリスト',
            removeFromWhitelist: '有効にする',
            archive: 'アーカイブ',
            jumpToTrend: '傾向',
            deleteConfirmMsgAll: '{url} のすべての訪問記録が削除されます',
            deleteConfirmMsgRange: '{url} {start} から {end} までの訪問記録は削除されます',
            deleteConfirmMsg: '{date} の {url} の訪問記録は削除されます',
            exportWholeData: 'インポート',
            importWholeData: '書き出す'
        }
    }
}

export default _default