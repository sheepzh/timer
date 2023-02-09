/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type PopupDurationMessage = { [key in timer.option.PopupDuration]: string }

const _default: Messages<PopupDurationMessage> = {
    zh_CN: {
        today: '今日',
        thisWeek: '本周',
        thisMonth: '本月',
        last30Days: '近 30 天',
    },
    zh_TW: {
        today: '今日',
        thisWeek: '本週',
        thisMonth: '本月',
        last30Days: '近 30 天',
    },
    en: {
        today: 'Today\'s',
        thisWeek: 'This Week\'s',
        thisMonth: 'This Month\'s',
        last30Days: 'Last 30 days\'',
    },
    ja: {
        today: '今日の',
        thisWeek: '今週の',
        thisMonth: '今月の',
        last30Days: '過去 30 日間',
    },
}

export default _default