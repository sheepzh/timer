/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export type ChartMessage = {
    title: { [key in timer.popup.Duration]: string }
    mergeHostLabel: string
    fileName: string
    saveAsImageTitle: string
    restoreTitle: string
    options: string
    totalTime: string
    totalCount: string
    averageTime: string
    averageCount: string
    otherLabel: string
    updateVersion: string
    updateVersionInfo: string
    updateVersionInfo4Firefox: string
}

const _default: Messages<ChartMessage> = {
    zh_CN: {
        title: {
            today: '今日数据',
            thisWeek: '本周数据',
            thisMonth: '本月数据',
        },
        mergeHostLabel: '合并子域名',
        fileName: '上网时长清单_{today}_by_{app}',
        saveAsImageTitle: '保存',
        restoreTitle: '刷新',
        options: '设置',
        totalTime: '共 {totalTime}',
        totalCount: '共 {totalCount} 次',
        averageTime: '平均每天 {value}',
        averageCount: '平均每天 {value} 次',
        otherLabel: '其他{count}个网站',
        updateVersion: '版本升级',
        updateVersionInfo: '最新版本：{version}',
        updateVersionInfo4Firefox: '新版本 {version} 已发布\n\n您可以前往插件管理页进行更新',
    },
    zh_TW: {
        title: {
            today: '今日數據',
            thisWeek: '本週數據',
            thisMonth: '本月數據',
        },
        mergeHostLabel: '合並子網域',
        fileName: '上網時長清單_{today}_by_{app}',
        saveAsImageTitle: '保存',
        restoreTitle: '刷新',
        options: '設置',
        totalTime: '共 {totalTime}',
        totalCount: '共 {totalCount} 次',
        averageCount: '平均每天 {value} 次',
        averageTime: '平均每天 {value}',
        otherLabel: '其他{count}個站點',
        updateVersion: '版本昇級',
        updateVersionInfo: '最新版本：{version}',
        updateVersionInfo4Firefox: '新版本 {version} 已髮佈\n\n您可以前往插件管理頁進行更新',
    },
    en: {
        title: {
            today: 'Today\'s Data',
            thisWeek: 'This Week\'s Data',
            thisMonth: 'This Month\'s Data',
        },
        mergeHostLabel: 'Merge Sites',
        fileName: 'Web_Time_List_{today}_By_{app}',
        saveAsImageTitle: 'Snapshot',
        restoreTitle: 'Restore',
        options: 'Options',
        totalTime: 'Total {totalTime}',
        totalCount: 'Total {totalCount} times',
        averageCount: '{value} times per day on average',
        averageTime: '{value} per day on average',
        otherLabel: 'Other {count} sites',
        updateVersion: 'Updatable',
        updateVersionInfo: 'Latest: {version}',
        updateVersionInfo4Firefox: 'Upgrade to {version} in the management page, about:addons, pls',
    },
    ja: {
        title: {
            today: '今日のデータ',
            thisWeek: '今週のデータ',
            thisMonth: '今月のデータ',
        },
        mergeHostLabel: 'URLをマージ',
        fileName: 'オンライン時間_{today}_by_{app}',
        saveAsImageTitle: 'ダウンロード',
        restoreTitle: '刷新',
        options: '設定',
        totalTime: '合計 {totalTime}',
        totalCount: '合計 {totalCount} 回',
        averageTime: '1日平均 {value}',
        averageCount: '1日平均 {value} 回',
        otherLabel: '他{count}サイト',
        updateVersion: '更新',
        updateVersionInfo: '最新バージョン：{version}',
        updateVersionInfo4Firefox: '管理ページで {version} にアップグレードしてください',
    },
}


export default _default