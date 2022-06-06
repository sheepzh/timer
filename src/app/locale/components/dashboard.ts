/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"

export type DashboardMessage = {
    heatMap: {
        title0: string
        title1: string
        tooltip0: string
        tooltip1: string
    }
    topK: {
        title: string
        tooltip: string
    }
    indicator: {
        installedDays: string
        visitCount: string
        browsingTime: string
        mostUse: string
    }
    weekOnWeek: {
        title: string
        lastBrowse: string
        thisBrowse: string
        wow: string
        increase: string
        decline: string
    },
    feedback: {
        button: string
        tooltip: string
    }
}

// Not display if not zh_CN
const EMPTY_FEEDBACK = {
    button: '',
    tooltip: ''
}

const _default: Messages<DashboardMessage> = {
    zh_CN: {
        heatMap: {
            title0: '近一年上网总时长超过 {hour} 小时',
            title1: '近一年上网总时长不足 1 小时',
            tooltip0: '{year}/{month}/{day} 浏览网页 {minute} 分钟',
            tooltip1: '{year}/{month}/{day} 浏览网页 {hour} 小时 {minute} 分钟',
        },
        topK: {
            title: '近 {day} 天最常访问 TOP {k}',
            tooltip: '访问 {host} {visit} 次',
        },
        indicator: {
            installedDays: '已使用 {number} 天',
            visitCount: '累计访问过 {site} 个网站共 {visit} 次',
            browsingTime: '浏览时长超过 {minute} 分钟',
            mostUse: '最喜欢在 {start} 点至 {end} 点之间打开浏览器',
        },
        weekOnWeek: {
            title: '近一周浏览时长环比变化 TOP {k}',
            lastBrowse: '上周浏览 {time}',
            thisBrowse: '本周浏览 {time}',
            wow: '环比{state} {delta}',
            increase: '增长',
            decline: '减少',
        },
        feedback: {
            button: '反馈',
            tooltip: '告诉作者您对仪表盘新功能的感受~'
        },
    },
    zh_TW: {
        heatMap: {
            title0: '近一年上網總時長超過 {hour} 小時',
            title1: '近一年上網總時長不足 1 小時',
            tooltip0: '{year}/{month}/{day} 瀏覽網頁 {minute} 分鐘',
            tooltip1: '{year}/{month}/{day} 瀏覽網頁 {hour} 小時 {minute} 分鐘',
        },
        topK: {
            title: '近 {day} 天最常訪問 TOP {k}',
            tooltip: '訪問 {host} {visit} 次',
        },
        indicator: {
            installedDays: '已使用 {number} 天',
            visitCount: '訪問過 {site} 個網站總計 {visit} 次',
            browsingTime: '瀏覽網頁超過 {minute} 分鐘',
            mostUse: '最喜歡在 {start} 點至 {end} 點之間上網',
        },
        weekOnWeek: {
            title: '近一周瀏覽時長環比變化 TOP {k}',
            lastBrowse: '上週瀏覽 {time}',
            thisBrowse: '本週瀏覽 {time}',
            wow: '環比{state} {delta}',
            increase: '增長',
            decline: '減少',
        },
        feedback: EMPTY_FEEDBACK
    },
    en: {
        heatMap: {
            title0: 'Browsed {hour}+ hours in the last year',
            title1: 'Browsed for <1 hour in the last year',
            tooltip0: 'Browsed for {minute} minute(s) on {month}/{day}/{year}',
            tooltip1: 'Browsed for {hour} hour(s) {minute} minute(s) on {month}/{day}/{year}',
        },
        topK: {
            title: 'Most visited TOP {k} last {day} days',
            tooltip: 'Visit {host} {visit} times',
        },
        indicator: {
            installedDays: '{number} days in use',
            visitCount: '{visit} total visits to {site} sites',
            browsingTime: 'Browsed for more than {minute} minutes',
            mostUse: 'Favorite to browse between {start} and {end} o\'clock',
        },
        weekOnWeek: {
            title: 'Week-on-week change of browsing time TOP {k}',
            lastBrowse: 'Browsed {time} last week',
            thisBrowse: 'browsed {time} this week',
            wow: 'week-on-week {state} {delta}',
            increase: 'growth',
            decline: 'decrease',
        },
        feedback: EMPTY_FEEDBACK
    },
    ja: {
        heatMap: {
            title0: '過去1年間に {hour} 時間以上オンラインで過ごした',
            title1: '過去 1 年間にオンラインで費やした時間は 1 時間未満',
            tooltip0: '{year} 年 {month} 月 {day} 日 {minute} 分間ウェブを閲覧する',
            tooltip1: '{year} 年 {month} 月 {day} 日 ウェブを {hour} 時間 {minute} 分閲覧する',
        },
        topK: {
            title: '過去 {day} 日間に最も訪問された TOP {k}',
            tooltip: '{host} {visit} 回訪問',
        },
        indicator: {
            installedDays: '使用 {number} 日',
            visitCount: '{site} つのサイトへの合計 {visit} 回の訪問',
            browsingTime: '{minute} 分以上ウェブを閲覧する',
            mostUse: '{start}:00 から {end}:00 までのお気に入りのインターネットアクセス'
        },
        weekOnWeek: {
            title: '週ごとの変更 TOP {k}',
            lastBrowse: '先週 {time} 閲覧',
            thisBrowse: '今週は {time} で閲覧',
            wow: '毎週 {delta} の {state}',
            increase: '増加',
            decline: '減らす',
        },
        feedback: EMPTY_FEEDBACK
    },
}

export default _default