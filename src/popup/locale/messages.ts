/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"
import chromeBase from "@util/i18n/components/app"
import itemMessages, { ItemMessage } from "@util/i18n/components/item"
import popupDurationMessages, { PopupDurationMessage } from "@util/i18n/components/popup-duration"

export type PopupMessage = {
    title: { [key in Timer.PopupDuration]: string }
    mergeHostLabel: string
    viewMore: string
    fileName: string
    saveAsImageTitle: string
    restoreTitle: string
    totalTime: string
    totalCount: string
    otherLabel: string
    updateVersion: string
    updateVersionInfo: string
    updateVersionInfo4Firefox: string
    currentVersion: string
    appName: string
    item: ItemMessage
    timeDuration: PopupDurationMessage
}

const _default: Messages<PopupMessage> = {
    zh_CN: {
        title: {
            today: "今日数据",
            thisWeek: "本周数据",
            thisMonth: "本月数据"
        },
        mergeHostLabel: '合并子域名',
        viewMore: '所有功能',
        fileName: '上网时长清单_{today}_by_{app}',
        saveAsImageTitle: '保存',
        restoreTitle: '刷新',
        totalTime: '共 {totalTime}',
        totalCount: '共 {totalCount} 次',
        otherLabel: '其他',
        updateVersion: '版本升级',
        updateVersionInfo: '最新版本：{version}',
        updateVersionInfo4Firefox: '新版本 {version} 已发布\n\n您可以前往插件管理页进行更新',
        currentVersion: chromeBase.zh_CN.currentVersion,
        appName: chromeBase.zh_CN.name,
        item: itemMessages.zh_CN,
        timeDuration: popupDurationMessages.zh_CN
    },
    zh_TW: {
        title: {
            today: "今日數據",
            thisWeek: "本週數據",
            thisMonth: "本月數據"
        },
        mergeHostLabel: '合並子網域',
        viewMore: '所有功能',
        fileName: '上網時長清單_{today}_by_{app}',
        saveAsImageTitle: '保存',
        restoreTitle: '刷新',
        totalTime: '共 {totalTime}',
        totalCount: '共 {totalCount} 次',
        otherLabel: '其他',
        updateVersion: '版本昇級',
        updateVersionInfo: '最新版本：{version}',
        updateVersionInfo4Firefox: '新版本 {version} 已髮佈\n\n您可以前往插件管理頁進行更新',
        currentVersion: chromeBase.zh_TW.currentVersion,
        appName: chromeBase.zh_TW.name,
        item: itemMessages.zh_TW,
        timeDuration: popupDurationMessages.zh_TW
    },
    en: {
        title: {
            today: 'Today\'s Data',
            thisWeek: "This Week\'s Data",
            thisMonth: "This Month\'s Data"
        },
        mergeHostLabel: 'Merge Sites',
        viewMore: 'All Functions',
        fileName: 'Web_Time_List_{today}_By_{app}',
        saveAsImageTitle: 'Snapshot',
        restoreTitle: 'Restore',
        totalTime: 'Total {totalTime}',
        totalCount: 'Total {totalCount} times',
        otherLabel: 'Others',
        updateVersion: 'Updatable',
        updateVersionInfo: 'Latest: {version}',
        updateVersionInfo4Firefox: 'Upgrade to {version} in the management page, about:addons, pls',
        currentVersion: chromeBase.en.currentVersion,
        appName: chromeBase.en.name,
        item: itemMessages.en,
        timeDuration: popupDurationMessages.en
    },
    ja: {
        title: {
            today: "今日のデータ",
            thisWeek: "今週のデータ",
            thisMonth: "今月のデータ"
        },
        mergeHostLabel: 'URLをマージ',
        viewMore: '続きを見る',
        fileName: 'オンライン時間_{today}_by_{app}',
        saveAsImageTitle: 'ダウンロード',
        restoreTitle: '刷新',
        totalTime: '合計 {totalTime}',
        totalCount: '合計 {totalCount} 回',
        otherLabel: 'その他',
        updateVersion: '更新',
        updateVersionInfo: '最新バージョン：{version}',
        updateVersionInfo4Firefox: '管理ページで {version} にアップグレードしてください',
        currentVersion: chromeBase.ja.currentVersion,
        appName: chromeBase.ja.name,
        item: itemMessages.ja,
        timeDuration: popupDurationMessages.ja
    }
}

export default _default