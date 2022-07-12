/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"

export type TrendMessage = {
    hostPlaceholder: string
    startDate: string,
    endDate: string
    lastWeek: string
    last15Days: string
    last30Days: string
    last90Days: string
    history: {
        title: string
        timeUnit: string
        numberUnit: string
    }
    saveAsImageTitle: string
    defaultSubTitle: string
    merged: string
}

const _default: Messages<TrendMessage> = {
    zh_CN: {
        hostPlaceholder: '搜索你想分析的域名',
        startDate: '开始日期',
        endDate: '结束日期',
        lastWeek: '最近 7 天',
        last15Days: '最近 15 天',
        last30Days: '最近 30 天',
        last90Days: '最近 90 天',
        history: {
            title: '历史记录',
            timeUnit: '时长 / 秒',
            numberUnit: '次'
        },
        saveAsImageTitle: '保存',
        defaultSubTitle: '请先在左上角选择需要分析的域名',
        merged: '合并'
    },
    zh_TW: {
        hostPlaceholder: '蒐索你想分析的網域',
        startDate: '開始日期',
        endDate: '結束日期',
        lastWeek: '最近 7 天',
        last15Days: '最近 15 天',
        last30Days: '最近 30 天',
        last90Days: '最近 90 天',
        history: {
            title: '曆史記錄',
            timeUnit: '時長 / 秒',
            numberUnit: '次'
        },
        saveAsImageTitle: '保存',
        defaultSubTitle: '請先在左上角選擇需要分析的網域',
        merged: '合並'
    },
    en: {
        hostPlaceholder: 'Search site URL',
        startDate: 'Start date',
        endDate: 'End date',
        lastWeek: 'Last week',
        last15Days: 'Last 15 days',
        last30Days: 'Last 30 days',
        last90Days: 'Last 90 days',
        history: {
            title: 'Trend',
            timeUnit: 'Time / second',
            numberUnit: 'Visit Counts'
        },
        saveAsImageTitle: 'Snapshot',
        defaultSubTitle: 'Search and select one URL to analyze on the top-left corner, pls',
        merged: 'Merged'
    },
    ja: {
        hostPlaceholder: 'ドメイン名を検索',
        startDate: '開始日',
        endDate: '終了日',
        lastWeek: '先週',
        last15Days: '過去 15 日間',
        last30Days: '過去 30 日間',
        last90Days: '過去 90 日間',
        history: {
            title: '歴史記録',
            timeUnit: '時間 / 秒',
            numberUnit: '回'
        },
        saveAsImageTitle: 'ダウンロード',
        defaultSubTitle: 'まず、左上隅で分析するドメイン名を選択します',
        merged: '合并'
    }
}

export default _default