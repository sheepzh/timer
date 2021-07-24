import { Messages } from "../../../util/i18n"

export type MenuMessage = {
    data: string
    dataReport: string
    dataHistory: string
    dataClear: string
    additional: string
    option: string
    behavior: string
    habit: string
    limit: string
}
const _default: Messages<MenuMessage> = {
    zh_CN: {
        data: '我的数据',
        dataReport: '报表明细',
        dataHistory: '历史趋势',
        dataClear: '内存管理',
        additional: '附加功能',
        option: '扩展选项',
        behavior: '上网行为',
        habit: '上网习惯',
        limit: '每日时限设置'
    },
    en: {
        data: 'My Data',
        dataReport: 'Record',
        dataHistory: 'Trend',
        dataClear: 'Memory Situation',
        additional: 'Additional Functions',
        option: 'Options',
        behavior: 'User Behavior',
        habit: 'Habits',
        limit: 'Browsing Limit'
    },
    ja: {
        data: '私のデータ',
        dataReport: '報告する',
        dataHistory: '歴史傾向',
        dataClear: '記憶状況',
        additional: 'その他の機能',
        option: '拡張設定',
        behavior: 'ユーザーの行動',
        habit: '閲覧の習慣',
        limit: '閲覧の制限'
    }
}

export default _default