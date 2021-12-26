/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "../../../util/i18n"

export type HabitMessage = {
    sizes: {
        fifteen: string
        halfHour: string
        hour: string
        twoHour: string
    },
    average: {
        label: string
    },
    dateRange: {
        lateDay: string
        late3Days: string
        lateWeek: string
        late15Days: string
        late30Days: string
        late60Days: string
    },
    chart: {
        title: string
        saveAsImageTitle: string
        yAxisName: string
    }
}

const _default: Messages<HabitMessage> = {
    zh_CN: {
        sizes: {
            fifteen: '按十五分钟统计',
            halfHour: '按半小时统计',
            hour: '按一小时统计',
            twoHour: '按两小时统计'
        },
        average: {
            label: '平均每天'
        },
        dateRange: {
            lateDay: '最近 24 小时',
            late3Days: '最近 3 天',
            lateWeek: '最近 7 天',
            late15Days: '最近 15 天',
            late30Days: '最近 30 天',
            late60Days: '最近 60 天'
        },
        chart: {
            title: '上网习惯统计',
            saveAsImageTitle: '保存',
            yAxisName: '浏览时长 / 秒'
        }
    },
    en: {
        sizes: {
            fifteen: 'Per 15 minutes',
            halfHour: 'Per half hour',
            hour: 'Per one hour',
            twoHour: 'Per two hours'
        },
        average: {
            label: 'Daily Average'
        },
        dateRange: {
            lateDay: 'Late day',
            late3Days: 'Late 3 days',
            lateWeek: 'Late week',
            late15Days: 'Late 15 days',
            late30Days: 'Late 30 days',
            late60Days: 'Late 60 days'
        },
        chart: {
            title: 'Time-phased Statistics of Browsing',
            saveAsImageTitle: 'Snapshot',
            yAxisName: 'Browse Time / second(s)'
        }
    },
    ja: {
        sizes: {
            fifteen: '15分で統計',
            halfHour: '30分で統計',
            hour: '1時間ごとの統計',
            twoHour: '2時間ごとの統計'
        },
        average: {
            label: '1日平均'
        },
        dateRange: {
            lateDay: '過去24時間',
            late3Days: '過去3日間',
            lateWeek: '先週',
            late15Days: '過去15日間',
            late30Days: '過去30日間',
            late60Days: '過去60日間'
        },
        chart: {
            title: '時系列の統計を閲覧する',
            saveAsImageTitle: 'ダウンロード',
            yAxisName: '閲覧時間/秒'
        }
    }
}

export default _default