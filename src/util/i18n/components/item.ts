/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Messages } from ".."

export type ItemMessage = {
    date: string
    host: string
    // @deprecated v1.3.4
    total: string
    // @since v1.3.4
    // @deprecated v1.3.4
    totalTip: string
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
        totalTip: '许多用户反应该数据实际作用不大。作者深思熟虑，打算于不久的将来下线它。如果您有疑问，欢迎提交反馈。',
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
    zh_TW: {
        date: '日期',
        host: '域名',
        total: '運行時長',
        totalTip: '許多用戶反應該數據實際作用不大。作者深思熟慮，打算於不久的將來下線它。如果您有疑問，歡迎提交反饋。',
        focus: '瀏覽時長',
        time: '訪問次數',
        operation: {
            label: '操作',
            delete: '刪除',
            add2Whitelist: '白名單',
            removeFromWhitelist: '啟用',
            archive: '歸檔',
            jumpToTrend: '趨勢',
            deleteConfirmMsgAll: '{url} 的所有拜訪記錄將被刪除',
            deleteConfirmMsgRange: '{url} 在 {start} 到 {end} 的拜訪記錄將被刪除',
            deleteConfirmMsg: '{url} 在 {date} 的拜訪記錄將被刪除',
            exportWholeData: '導出數據',
            importWholeData: '導入數據'
        }
    },
    en: {
        date: 'Date',
        host: 'Site URL',
        total: 'Running Time',
        totalTip: 'The author plans to take this column offline in the near future. If you have questions, feel free to submit feedback.',
        focus: 'Browsing Time',
        time: 'Site Visits',
        operation: {
            label: 'Operations',
            delete: 'Delete',
            add2Whitelist: 'Whitelist',
            removeFromWhitelist: 'Enable',
            archive: 'Archive',
            jumpToTrend: 'Trend',
            deleteConfirmMsgAll: 'All records of {url} will be deleted!',
            deleteConfirmMsgRange: 'All records of {url} between {start} and {end} will be deleted!',
            deleteConfirmMsg: 'The record of {url} on {date} will be deleted!',
            exportWholeData: 'Export Data',
            importWholeData: 'Import Data'
        }
    },
    ja: {
        date: '日期',
        host: 'URL',
        total: '実行時間',
        totalTip: '著者は、近い将来にオフラインにする予定です。 ご不明な点がございましたら、お気軽にフィードバックを送信してください。',
        focus: '閲覧時間',
        time: '拜訪回数',
        operation: {
            label: '操作',
            delete: '削除',
            add2Whitelist: 'ホワイトリスト',
            removeFromWhitelist: '有効にする',
            archive: 'アーカイブ',
            jumpToTrend: '傾向',
            deleteConfirmMsgAll: '{url} のすべての拜訪記録が削除されます',
            deleteConfirmMsgRange: '{url} {start} から {end} までの拜訪記録は削除されます',
            deleteConfirmMsg: '{date} の {url} の拜訪記録は削除されます',
            exportWholeData: 'インポート',
            importWholeData: '書き出す'
        }
    }
}

export default _default
