import { Messages } from "../../../util/i18n"

export type MenuMessage = {
    data: string
    dataReport: string
    dataHistory: string
    dataClear: string
    behavior: string
    habit: string
    limit: string
    additional: string
    whitelist: string
    mergeRule: string
    option: string
    other: string
    feedback: string
    rate: string
}
const _default: Messages<MenuMessage> = {
    zh_CN: {
        data: '我的数据',
        dataReport: '报表明细',
        dataHistory: '历史趋势',
        dataClear: '内存管理',
        additional: '附加功能',
        whitelist: '白名单管理',
        mergeRule: '子域名合并',
        option: '扩展选项',
        behavior: '上网行为',
        habit: '上网习惯',
        limit: '每日时限设置',
        other: '其他',
        feedback: '有什么反馈吗？',
        rate: '打个分吧！'
    },
    en: {
        data: 'My Data',
        dataReport: 'Record',
        dataHistory: 'Trend',
        dataClear: 'Memory Situation',
        behavior: 'User Behavior',
        habit: 'Habits',
        limit: 'Browsing Limit',
        additional: 'Additional Functions',
        whitelist: 'Whitelist',
        mergeRule: 'Merge-site Rules',
        other: 'Other Features',
        option: 'Options',
        feedback: 'Feedback',
        rate: 'Rate It'
    },
    ja: {
        data: '私のデータ',
        dataReport: '報告する',
        dataHistory: '歴史傾向',
        dataClear: '記憶状況',
        behavior: 'ユーザーの行動',
        habit: '閲覧の習慣',
        limit: '閲覧の制限',
        additional: 'その他の機能',
        whitelist: 'Webホワイトリスト',
        mergeRule: 'ドメイン合併',
        other: 'その他の機能',
        option: '拡張設定',
        feedback: 'フィードバック',
        rate: 'それを評価'
    }
}

export default _default