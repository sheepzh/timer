/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "../../../util/i18n"

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
        migrated: '成功导入'
    },
    en: {
        totalMemoryAlert: 'The browser provides {size}MB to store local data for each extension',
        totalMemoryAlert1: 'Unable to determine the maximum memory available allowed by the browser',
        usedMemoryAlert: '{size}MB is currently used',
        operationAlert: 'You can archive or delete those irrelevant data to reduce memory usage',
        filterItems: 'Filter data',
        filterFocus: 'The browsing time of the day is between {start} seconds and {end} seconds.',
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
        migrated: 'Successfully imported!'
    },
    ja: {
        totalMemoryAlert: 'ブラウザは、データを保存するために各拡張機能に {size}MB のメモリを提供します',
        totalMemoryAlert1: 'ブラウザで許可されている各拡張機能で使用可能な最大メモリを特定できません',
        usedMemoryAlert: '現在 {size}MB が使用されています',
        operationAlert: 'これらの無関係なデータをアーカイブまたは削除して、メモリ使用量を減らすことができます',
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
        migrated: '正常にインポートされました'
    }
}

export default _default