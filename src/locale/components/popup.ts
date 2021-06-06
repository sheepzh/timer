import { Messages } from "../constant"

export type PopupMessage = {
    title: string
    mergeDomainLabel: string
    viewMore: string
    fileName: string
    saveAsImageTitle: string
    totalTime: string
    totalCount: string
    otherLabel: string
}
const _default: Messages<PopupMessage> = {
    zh_CN: {
        title: '今日数据',
        mergeDomainLabel: '合并子域名',
        viewMore: '更多内容',
        fileName: '上网时长清单_{today}_by_{app}',
        saveAsImageTitle: '保存',
        totalTime: '共 {totalTime}',
        totalCount: '共 {totalCount} 次',
        otherLabel: '其他'
    },
    en: {
        title: 'Today\'s Data',
        mergeDomainLabel: 'Merge Subdomain',
        viewMore: 'More',
        fileName: 'Web_Time_List_{today}_By_{app}',
        saveAsImageTitle: 'Save',
        totalTime: 'Total {totalTime}',
        totalCount: 'Total {totalCount} times',
        otherLabel: 'Others'
    },
    ja: {
        title: '今日のデータ',
        mergeDomainLabel: 'URLをマージ',
        viewMore: '続きを見る',
        fileName: 'オンライン時間_{today}_by_{app}',
        saveAsImageTitle: 'ダウンロード',
        totalTime: '合計 {totalTime}',
        totalCount: '合計 {totalCount} 回',
        otherLabel: 'その他'
    }
}

export default _default