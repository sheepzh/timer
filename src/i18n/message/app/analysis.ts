/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type AnalysisMessage = {
    common: {
        focusTotal: string
        visitTotal: string
        ringGrowth: string
        merged: string
        virtual: string
        hostPlaceholder: string
        emptyDesc: string
    }
    summary: {
        title: string
        day: string
        firstDay: string
    }
    trend: {
        title: string
        startDate: string,
        endDate: string
        lastWeek: string
        last15Days: string
        last30Days: string
        last90Days: string
        activeDay: string
        totalDay: string
        maxFocus: string
        averageFocus: string
        maxVisit: string
        averageVisit: string
        focusTitle: string
        visitTitle: string
    }
}

const _default: Messages<AnalysisMessage> = {
    zh_CN: {
        common: {
            focusTotal: '总计浏览时长',
            visitTotal: '总计访问次数',
            ringGrowth: '与上期相比 {value}',
            merged: '合并',
            virtual: '自定义',
            hostPlaceholder: '搜索你想分析的站点',
            emptyDesc: '未选择站点'
        },
        summary: {
            title: '数据总览',
            day: '总计活跃天数',
            firstDay: '首次访问 {value}',
        },
        trend: {
            title: '区间趋势',
            startDate: '开始日期',
            endDate: '结束日期',
            lastWeek: '最近 7 天',
            last15Days: '最近 15 天',
            last30Days: '最近 30 天',
            last90Days: '最近 90 天',
            activeDay: '活跃天数',
            totalDay: '区间总天数',
            maxFocus: '单日最大浏览时长',
            averageFocus: '单日平均浏览时长',
            maxVisit: '单日最大访问次数',
            averageVisit: '单日平均访问次数',
            focusTitle: '浏览时长趋势',
            visitTitle: '访问次数趋势',
        }
    },
    zh_TW: {
        common: {
            focusTotal: '總計瀏覽時長',
            visitTotal: '總計訪問次數',
            ringGrowth: '與前期相比 {value}',
            merged: '合並',
            virtual: '自定義',
            hostPlaceholder: '蒐索你想分析的站點',
            emptyDesc: '未選擇站點',
        },
        summary: {
            title: '數據總覽',
            day: '總計活躍天數',
            firstDay: '首次訪問 {value}',
        },
        trend: {
            title: '區間趨勢',
            startDate: '開始日期',
            endDate: '結束日期',
            lastWeek: '最近 7 天',
            last15Days: '最近 15 天',
            last30Days: '最近 30 天',
            last90Days: '最近 90 天',
            activeDay: '活躍天數',
            totalDay: '區間總天數',
            maxFocus: '單日最大瀏覽時長',
            averageFocus: '單日平均瀏覽時長',
            maxVisit: '單日最大訪問次數',
            averageVisit: '單日平均訪問次數',
            focusTitle: '瀏覽時長趨勢',
            visitTitle: '訪問次數趨勢',
        }
    },
    en: {
        common: {
            focusTotal: 'Total browsing time',
            visitTotal: 'Total visits',
            ringGrowth: '{value} compared to the previous period',
            merged: 'Merged',
            virtual: 'Virtual',
            hostPlaceholder: 'Search for a site to analyze',
            emptyDesc: 'No site selected',
        },
        summary: {
            title: 'Summary',
            day: 'Total active days',
            firstDay: 'First visit {value}',
        },
        trend: {
            title: 'Trends',
            startDate: 'Start date',
            endDate: 'End date',
            lastWeek: 'Last week',
            last15Days: 'Last 15 days',
            last30Days: 'Last 30 days',
            last90Days: 'Last 90 days',
            activeDay: 'Active days',
            totalDay: 'Period days',
            maxFocus: 'Daily maximum browsing time',
            averageFocus: 'Daily average browsing time',
            maxVisit: 'Daily maximum visits',
            averageVisit: 'Daily average visits',
            focusTitle: 'Browsing Time Trends',
            visitTitle: 'Visit Trends',
        }
    },
    ja: {
        common: {
            focusTotal: '総閲覧時間',
            visitTotal: '総訪問数',
            ringGrowth: '前期比 {value}',
            merged: '合并',
            virtual: 'カスタマイズ',
            hostPlaceholder: 'ドメイン名を検索',
            emptyDesc: 'サイトは空です',
        },
        summary: {
            title: 'Summary',
            day: 'Total active days',
            firstDay: 'First visit {value}',
        },
        trend: {
            title: 'レンジトレンド',
            startDate: '開始日',
            endDate: '終了日',
            lastWeek: '過去 7 日間',
            last15Days: '過去 15 日間',
            last30Days: '過去 30 日間',
            last90Days: '過去 90 日間',
            activeDay: 'アクティブな日',
            totalDay: '間隔の合計日数',
            maxFocus: '1 日の最大閲覧時間',
            averageFocus: '1 日あたりの平均閲覧時間',
            maxVisit: '1 日あたりの最大訪問数',
            averageVisit: '1 日あたりの平均訪問数',
            focusTitle: 'タイム トレンドの閲覧',
            visitTitle: '訪問数の傾向',
        }
    }
}

export default _default