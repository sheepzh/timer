/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"

export type MenuMessage = {
    data: string
    dataReport: string
    dataHistory: string
    dataClear: string
    behavior: string
    habit: string
    limit: string
    additional: string
    siteManage: string
    whitelist: string
    mergeRule: string
    option: string
    other: string
    feedback: string
    rate: string
    meat: string
    translationMistake: string
}
const _default: Messages<MenuMessage> = {
    zh_CN: {
        data: '我的数据',
        dataReport: '报表明细',
        dataHistory: '历史趋势',
        dataClear: '内存管理',
        additional: '附加功能',
        siteManage: '网站名称管理',
        whitelist: '白名单管理',
        mergeRule: '子域名合并',
        option: '扩展选项',
        behavior: '上网行为',
        habit: '上网习惯',
        limit: '每日时限设置',
        other: '其他',
        feedback: '有什么反馈吗？',
        rate: '打个分吧！',
        meat: '请作者吃饭~',
        translationMistake: '提交翻译错误'
    },
    zh_TW: {
        data: '我的數據',
        dataReport: '報表明細',
        dataHistory: '曆史趨勢',
        dataClear: '內存管理',
        additional: '附加功能',
        siteManage: '網站名稱管理',
        whitelist: '白名單管理',
        mergeRule: '子域名合並',
        option: '擴展選項',
        behavior: '上網行爲',
        habit: '上網習慣',
        limit: '每日時限設置',
        other: '其他',
        feedback: '有什麼反饋嗎？',
        rate: '打個分吧！',
        meat: '請作者吃飯~',
        translationMistake: '改善翻译~'
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
        siteManage: 'Site Management',
        whitelist: 'Whitelist',
        mergeRule: 'Merge-site Rules',
        other: 'Other Features',
        option: 'Options',
        feedback: 'Feedback',
        rate: 'Rate It',
        meat: 'Invite the author to dinner',
        translationMistake: 'Improve translation'
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
        siteManage: 'ウェブサイト管理',
        whitelist: 'Webホワイトリスト',
        mergeRule: 'ドメイン合併',
        other: 'その他の機能',
        option: '拡張設定',
        feedback: 'フィードバック',
        rate: 'それを評価',
        meat: '著者を夕食に招待する',
        translationMistake: '翻訳を改善する'
    }
}

export default _default