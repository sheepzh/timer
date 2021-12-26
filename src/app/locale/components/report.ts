/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "../../../util/i18n"

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
        removeFromWhitelist: '成功从白名单移除'
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
        removeFromWhitelist: 'Removed from the whitelist'
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
        removeFromWhitelist: 'ホワイトリストから正常に削除されました'
    }
}

export default _default