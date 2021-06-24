import { Messages } from "../../../util/i18n"

export type PeriodMessage = {
    sizes: {
        fifteen: string
        halfHour: string
        hour: string
    },
    merge: {
        label: string
    },
    dateRange: {
        latestDay: string
        latestWeek: string
        latest15Days: string
    },
    chart: {
        title: string
        saveAsImageTitle: string
        yAxisName: string
    }
}

const _default: Messages<PeriodMessage> = {
    zh_CN: {
        sizes: {
            fifteen: '按十五分钟统计',
            halfHour: '按半小时统计',
            hour: '按一小时统计'
        },
        merge: {
            label: '按天合并'
        },
        dateRange: {
            latestDay: '最近 24 小时',
            latestWeek: '最近一周',
            latest15Days: '最近 15 天'
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
            hour: 'By one hour'
        },
        merge: {
            label: 'Merged'
        },
        dateRange: {
            latestDay: 'Latest day',
            latestWeek: 'Latest week',
            latest15Days: 'Latest 15 days'
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
            hour: '1時間ごとの統計'
        },
        merge: {
            label: 'マージ'
        },
        dateRange: {
            latestDay: '過去24時間',
            latestWeek: '先週',
            latest15Days: '過去15日間'
        },
        chart: {
            title: '時系列の統計を閲覧する',
            saveAsImageTitle: 'ダウンロード',
            yAxisName: '閲覧時間/秒'
        }
    }
}

export default _default