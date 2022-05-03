/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "@util/i18n"

export type DataManageMessage = {
    totalMemoryAlert: string
    totalMemoryAlert1: string
    usedMemoryAlert: string
    operationAlert: string
    filterItems: string
    filterFocus: string
    filterTotal: string
    filterTime: string
    filterDate: string
    unlimited: string
    archiveAlert: string
    dateShortcut: {
        tillYesterday: string
        till7DaysAgo: string
        till30DaysAgo: string
    }
    paramError: string
    deleteConfirm: string
    deleteSuccess: string
    archiveConfirm: string
    archiveSuccess: string
    migrationAlert: string
    importError: string
    migrated: string
    operationCancel: string
    operationConfirm: string
}

const _default: Messages<DataManageMessage> = {
    zh_CN: {
        totalMemoryAlert: '浏览器为每个扩展提供 {size}MB 来存储本地数据',
        totalMemoryAlert1: '无法确定浏览器允许的最大可用内存',
        usedMemoryAlert: '当前已使用 {size}MB',
        operationAlert: '您可以归档或者删除那些无关紧要的数据，来减小内存空间',
        filterItems: '数据筛选',
        filterFocus: '当日阅览时间在 {start} 秒至 {end} 秒之间。',
        filterTotal: '当日运行时间在 {start} 秒至 {end} 秒之间。',
        filterTime: '当日打开次数在 {start} 次至 {end} 次之间。',
        filterDate: '{picker} 产生的数据。',
        unlimited: '无限',
        archiveAlert: '归档后的数据不再按天统计，将累加至域名的归档数据中。',
        dateShortcut: {
            tillYesterday: '直到昨天',
            till7DaysAgo: '直到7天前',
            till30DaysAgo: '直到30天前'
        },
        paramError: '参数错误，请检查！',
        deleteConfirm: '共筛选出 {count} 条数据，是否全部删除？',
        deleteSuccess: '删除成功',
        archiveConfirm: '共筛选出 {count} 条数据，是否全部归档？',
        archiveSuccess: '归档成功',
        migrationAlert: '使用导入/导出在不同浏览器之间迁移数据',
        importError: '文件格式错误',
        migrated: '成功导入',
        operationCancel: "取消",
        operationConfirm: "确认",
    },
    zh_TW: {
        totalMemoryAlert: '瀏覽器爲每個擴展提供 {size}MB 來存儲本地數據',
        totalMemoryAlert1: '無法確定瀏覽器允許的最大可用內存',
        usedMemoryAlert: '當前已使用 {size}MB',
        operationAlert: '您可以歸檔或者刪除那些無關緊要的數據，來減小內存空間',
        filterItems: '數據篩選',
        filterFocus: '當日閱覽時間在 {start} 秒至 {end} 秒之間。',
        filterTotal: '當日運行時間在 {start} 秒至 {end} 秒之間。',
        filterTime: '當日打開次數在 {start} 次至 {end} 次之間。',
        filterDate: '{picker} 産生的數據。',
        unlimited: '無限',
        archiveAlert: '歸檔後的數據不再按天統計，將累加至域名的歸檔數據中。',
        dateShortcut: {
            tillYesterday: '直到昨天',
            till7DaysAgo: '直到7天前',
            till30DaysAgo: '直到30天前'
        },
        paramError: '參數錯誤，請檢查！',
        deleteConfirm: '共篩選出 {count} 條數據，是否全部刪除？',
        deleteSuccess: '刪除成功',
        archiveConfirm: '共篩選出 {count} 條數據，是否全部歸檔？',
        archiveSuccess: '歸檔成功',
        migrationAlert: '使用導入/導出在不同瀏覽器之間遷移數據',
        importError: '文件格式錯誤',
        migrated: '成功導入',
        operationCancel: "取消",
        operationConfirm: "確認",
    },
    en: {
        totalMemoryAlert: 'The browser provides {size}MB to store local data for each extension',
        totalMemoryAlert1: 'Unable to determine the maximum memory available allowed by the browser',
        usedMemoryAlert: '{size}MB is currently used',
        operationAlert: 'You can delete those irrelevant data to reduce memory usage',
        filterItems: 'Filter data',
        filterFocus: 'The browse time of the day is between {start} seconds and {end} seconds.',
        filterTotal: 'The running time of the day is between {start} seconds and {end} seconds.',
        filterTime: 'Visit count on the day is between {start} and {end}.',
        filterDate: 'Recorded between {picker}.',
        unlimited: '∞',
        archiveAlert: 'The archived details will be accumulated to its host and not recorded daily.',
        dateShortcut: {
            tillYesterday: 'Until yesterday',
            till7DaysAgo: 'Until 7 days ago',
            till30DaysAgo: 'Until 30 days ago'
        },
        paramError: 'Parameter error, please check!',
        deleteConfirm: 'A total of {count} details have been filtered out, delete all of them?',
        deleteSuccess: 'Successfully deleted',
        archiveConfirm: 'A total of {count} details have been filtered out, archive all of them?',
        archiveSuccess: 'Archived successfully',
        migrationAlert: 'Use import & export to migrate data between different browsers',
        importError: 'File format error',
        migrated: 'Successfully imported!',
        operationCancel: "Cancel",
        operationConfirm: "Confirm",
    },
    ja: {
        totalMemoryAlert: 'ブラウザは、データを保存するために各拡張機能に {size}MB のメモリを提供します',
        totalMemoryAlert1: 'ブラウザで許可されている各拡張機能で使用可能な最大メモリを特定できません',
        usedMemoryAlert: '現在 {size}MB が使用されています',
        operationAlert: '不要なデータを削除してメモリ容量を減らすことができます',
        filterItems: 'データフィルタリング',
        filterFocus: '当日の閲覧時間は、{start} 秒から {end} 秒の間です。',
        filterTotal: '当日の実行時間は、{start} 秒から {end} 秒の間です。',
        filterTime: '当日のオープン数は {start} から {end} の間です。',
        filterDate: '{picker} までに生成されたデータ',
        unlimited: '無制限',
        archiveAlert: 'アーカイブされたデータは毎日カウントされなくなり、ドメイン名のアーカイブされたデータに追加されます。',
        dateShortcut: {
            tillYesterday: '昨日まで',
            till7DaysAgo: '7日前まで',
            till30DaysAgo: '30日前まで'
        },
        paramError: 'パラメータエラー、確認してください！',
        deleteConfirm: '合計 {count} 個のデータが除外されました。すべて削除しますか？',
        deleteSuccess: '正常に削除されました',
        archiveConfirm: '合計 {count} 個のデータが除外されました。それらはすべてアーカイブされていますか？',
        archiveSuccess: '正常にアーカイブされました',
        migrationAlert: 'インポート/エクスポートを使用して、異なるブラウザ間でデータを移行します',
        importError: 'ファイル形式エラー',
        migrated: '正常にインポートされました',
        operationCancel: "取消",
        operationConfirm: "確認",
    }
}

export default _default