import { Messages } from "../../../util/i18n"

export type TrenderMessage = {
    hostPlaceholder: string
    startDate: string,
    endDate: string
    latestWeek: string
    latest15Days: string
    latest30Days: string
    latest90Days: string
    history: {
        title: string
        timeUnit: string
        numberUnit: string
    }
    saveAsImageTitle: string
    defaultSubTitle: string
    merged: string
}

const _default: Messages<TrenderMessage> = {
    zh_CN: {
        hostPlaceholder: '搜索你想分析的域名',
        startDate: '开始日期',
        endDate: '结束日期',
        latestWeek: '最近 7 天',
        latest15Days: '最近 15 天',
        latest30Days: '最近 30 天',
        latest90Days: '最近 90 天',
        history: {
            title: '历史记录',
            timeUnit: '时长 / 秒',
            numberUnit: '次'
        },
        saveAsImageTitle: '保存',
        defaultSubTitle: '请先在左上角选择需要分析的域名',
        merged: '合并'
    },
    en: {
        hostPlaceholder: 'Search the domain',
        startDate: 'Start date',
        endDate: 'End date',
        latestWeek: 'Latest Week',
        latest15Days: 'Latest 15 days',
        latest30Days: 'Latest 30 days',
        latest90Days: 'Latest 90 days',
        history: {
            title: 'History trender',
            timeUnit: 'Time / second(s)',
            numberUnit: 'time(s)'
        },
        saveAsImageTitle: 'Save',
        defaultSubTitle: 'Select the host to analyze on the top-left corner, pls',
        merged: 'Merged'
    },
    ja: {
        hostPlaceholder: 'ドメイン名を検索',
        startDate: '開始日',
        endDate: '終了日',
        latestWeek: '先週',
        latest15Days: '過去 15 日間',
        latest30Days: '過去 30 日間',
        latest90Days: '過去 90 日間',
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