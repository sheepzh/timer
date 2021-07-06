import { Messages } from '../../util/i18n'
import chromeBase from '../../util/i18n/components/app'
import itemMessages, { ItemMessage } from '../../util/i18n/components/item'

export type PopupMessage = {
    title: string
    mergeDomainLabel: string
    viewMore: string
    fileName: string
    saveAsImageTitle: string
    restoreTitle: string
    totalTime: string
    totalCount: string
    otherLabel: string
    feedback: String
    updateVersion: string
    updateVersionInfo: string
    currentVersion: string
    appName: string
    item: ItemMessage
}

const _default: Messages<PopupMessage> = {
    zh_CN: {
        title: '今日数据',
        mergeDomainLabel: '合并子域名',
        viewMore: '更多内容',
        fileName: '上网时长清单_{today}_by_{app}',
        saveAsImageTitle: '保存',
        restoreTitle: '刷新',
        totalTime: '共 {totalTime}',
        totalCount: '共 {totalCount} 次',
        otherLabel: '其他',
        feedback: '使用反馈',
        updateVersion: '版本升级',
        updateVersionInfo: '最新版本：{version}',
        currentVersion: chromeBase.zh_CN.currentVersion,
        appName: chromeBase.zh_CN.name,
        item: itemMessages.zh_CN
    },
    en: {
        title: 'Today\'s Data',
        mergeDomainLabel: 'Merge Subdomain',
        viewMore: 'More',
        fileName: 'Web_Time_List_{today}_By_{app}',
        saveAsImageTitle: 'Save',
        restoreTitle: 'Restore',
        totalTime: 'Total {totalTime}',
        totalCount: 'Total {totalCount} times',
        otherLabel: 'Others',
        feedback: 'Feedback',
        updateVersion: 'Updatable',
        updateVersionInfo: 'Latest: {version}',
        currentVersion: chromeBase.en.currentVersion,
        appName: chromeBase.en.name,
        item: itemMessages.en
    },
    ja: {
        title: '今日のデータ',
        mergeDomainLabel: 'URLをマージ',
        viewMore: '続きを見る',
        fileName: 'オンライン時間_{today}_by_{app}',
        saveAsImageTitle: 'ダウンロード',
        restoreTitle: '刷新',
        totalTime: '合計 {totalTime}',
        totalCount: '合計 {totalCount} 回',
        otherLabel: 'その他',
        feedback: 'フィードバック',
        updateVersion: '更新',
        updateVersionInfo: '最新バージョン：{version}',
        currentVersion: chromeBase.ja.currentVersion,
        appName: chromeBase.ja.name,
        item: itemMessages.ja
    }
}

export default _default