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
    lateWeek: string
    late15Days: string
    late30Days: string
    late90Days: string
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
        lateWeek: '最近 7 天',
        late15Days: '最近 15 天',
        late30Days: '最近 30 天',
        late90Days: '最近 90 天',
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
        lateWeek: '最近 7 天',
        late15Days: '最近 15 天',
        late30Days: '最近 30 天',
        late90Days: '最近 90 天',
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
        hostPlaceholder: 'Enter URL',
        startDate: 'Start date',
        endDate: 'End date',
        lateWeek: 'Late week',
        late15Days: 'Late 15 days',
        late30Days: 'Late 30 days',
        late90Days: 'Late 90 days',
        history: {
            title: 'Trend',
            timeUnit: 'Time / second(s)',
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
        lateWeek: '先週',
        late15Days: '過去 15 日間',
        late30Days: '過去 30 日間',
        late90Days: '過去 90 日間',
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