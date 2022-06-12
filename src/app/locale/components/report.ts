/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"

export type ReportMessage = {
    startDate: string
    endDate: string
    lateWeek: string
    late30Days: string
    today: string
    yesterday: string
    mergeDate: string
    mergeDomain: string
    displayBySecond: string
    hostPlaceholder: string
    exportFileName: string
    added2Whitelist: string
    removeFromWhitelist: string
    batchDelete: {
        noSelectedMsg: string
        confirmMsg: string
        confirmMsgAll: string
        confirmMsgRange: string
        successMsg: string
    }
}

const _default: Messages<ReportMessage> = {
    zh_CN: {
        startDate: '开始日期',
        endDate: '结束日期',
        lateWeek: '最近一周',
        late30Days: '最近 30 天',
        today: '今天',
        yesterday: '昨天',
        mergeDate: '合并日期',
        mergeDomain: '合并子域名',
        displayBySecond: '按秒显示',
        hostPlaceholder: '请输入域名，然后回车',
        exportFileName: '我的上网时间',
        added2Whitelist: '成功加入白名单',
        removeFromWhitelist: '成功从白名单移除',
        batchDelete: {
            noSelectedMsg: '请先在表格中勾选需要删除的行',
            confirmMsg: '{example} 等网站在 {date} 的 {count} 条记录将会被删除！',
            confirmMsgAll: '{example} 等网站的 {count} 条记录将会被删除！',
            confirmMsgRange: '{example} 等网站在 {start} 至 {end} 之间的 {count} 条记录将会被删除！',
            successMsg: '成功批量删除',
        }
    },
    zh_TW: {
        startDate: '開始日期',
        endDate: '結束日期',
        lateWeek: '最近一週',
        late30Days: '最近 30 天',
        today: '今天',
        yesterday: '昨天',
        mergeDate: '合並日期',
        mergeDomain: '合並子域名',
        displayBySecond: '按秒顯示',
        hostPlaceholder: '請輸入域名，然後回車',
        exportFileName: '我的上網時間',
        added2Whitelist: '成功加入白名單',
        removeFromWhitelist: '成功從白名單移除',
        batchDelete: {
            noSelectedMsg: '請先在表格中勾選需要刪除的行',
            confirmMsg: '{example} 等網站在 {date} 的 {count} 條記錄將會被刪除！',
            confirmMsgAll: '{example} 等網站的 {count} 條記錄將會被刪除！',
            confirmMsgRange: '{example} 等網站在 {start} 至 {end} 之間的 {count} 條記錄將會被刪除！',
            successMsg: '成功批量刪除',
        }
    },
    en: {
        startDate: 'Start date',
        endDate: 'End date',
        lateWeek: 'Late week',
        late30Days: 'Late 30 days',
        today: 'Today',
        yesterday: 'Yesterday',
        mergeDate: 'Merge date',
        mergeDomain: 'Merge sub-URL',
        displayBySecond: 'Display in seconds',
        hostPlaceholder: 'Input URL, press enter',
        exportFileName: 'Timer_Data',
        added2Whitelist: 'Added into the whitelist',
        removeFromWhitelist: 'Removed from the whitelist',
        batchDelete: {
            noSelectedMsg: 'Please select the row you want to delete in the table first',
            confirmMsg: '{count} records for sites like {example} on {date} will be deleted!',
            confirmMsgAll: '{count} records for sites like {example} will be deleted!',
            confirmMsgRange: '{count} records for sites like {example} between {start} and {end} will be deleted!',
            successMsg: 'Batch delete successfully',
        }
    },
    ja: {
        startDate: '開始日',
        endDate: '終了日',
        lateWeek: '先週',
        late30Days: '過去 30 日間',
        today: '今日',
        yesterday: '昨日',
        mergeDate: 'マージ日',
        mergeDomain: 'URLをマージ',
        displayBySecond: '秒単位で表示',
        hostPlaceholder: 'URL を入力してください',
        exportFileName: '私のウェブ時間データ',
        added2Whitelist: 'ホワイトリストに正常に追加されました',
        removeFromWhitelist: 'ホワイトリストから正常に削除されました',
        batchDelete: {
            noSelectedMsg: '最初にテーブルで削除する行にチェックマークを付けてください',
            confirmMsg: '{date} の {example} のようなサイトの {count} レコードは削除されます！',
            confirmMsgAll: '{example} のようなサイトの {count} レコードは削除されます！',
            confirmMsgRange: '{start} と {end} の間の {example} のようなサイトの {count} レコードが削除されます！',
            successMsg: 'バッチ削除に成功',
        }
    }
}

export default _default