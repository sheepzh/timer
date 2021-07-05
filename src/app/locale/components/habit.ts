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
        latestDay: string
        latest3Days: string
        latestWeek: string
        latest15Days: string
        latest30Days: string
        latest60Days: string
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
            latestDay: '最近 24 小时',
            latest3Days: '最近 3 天',
            latestWeek: '最近 7 天',
            latest15Days: '最近 15 天',
            latest30Days: '最近 30 天',
            latest60Days: '最近 60 天'
        },
        chart: {
            title: '上网习惯统计',
            saveAsImageTitle: '保存',
            yAxisName: '浏览时长 / 秒'
        }
    },
    en: {
        sizes: {
            fifteen: 'By 15 minute',
            halfHour: 'By half hour',
            hour: 'By one hour',
            twoHour: 'By two hours'
        },
        average: {
            label: 'Daily average'
        },
        dateRange: {
            latestDay: 'Latest day',
            latest3Days: 'Latest 3 days',
            latestWeek: 'Latest week',
            latest15Days: 'Latest 15 days',
            latest30Days: 'Latest 30 days',
            latest60Days: 'Latest 60 days'
        },
        chart: {
            title: 'Focus time-phased statistics',
            saveAsImageTitle: 'Save',
            yAxisName: 'Focus time [second]'
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
            latestDay: '過去24時間',
            latest3Days: '過去3日間',
            latestWeek: '先週',
            latest15Days: '過去15日間',
            latest30Days: '過去30日間',
            latest60Days: '過去60日間'
        },
        chart: {
            title: '時系列の統計を閲覧する',
            saveAsImageTitle: 'ダウンロード',
            yAxisName: '閲覧時間/秒'
        }
    }
}

export default _default