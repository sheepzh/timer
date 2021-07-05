import { Messages } from ".."

export type ItemMessage = {
    date: string
    host: string
    total: string
    focus: string
    time: string
    operation: {
        label: string
        delete: string
        add2Whitelist: string
        removeFromWhitelist: string
        archive: string
        confirmMsg: string
        cancelMsg: string
        deleteConfirmMsgAll: string
        deleteConfirmMsgRange: string
        deleteConfirmMsg: string
        jumpToTrender: string
    }
}

const _default: Messages<ItemMessage> = {
    zh_CN: {
        date: '日期',
        host: '域名',
        total: '运行时长',
        focus: '浏览时长',
        time: '打开次数',
        operation: {
            label: '操作',
            delete: '删除',
            add2Whitelist: '白名单',
            removeFromWhitelist: '启用',
            archive: '归档',
            jumpToTrender: '趋势',
            confirmMsg: '好的',
            cancelMsg: '不用了',
            deleteConfirmMsgAll: '{url} 的所有访问记录将被删除',
            deleteConfirmMsgRange: '{url} 在 {start} 到 {end} 的访问记录将被删除',
            deleteConfirmMsg: '{url} 在 {date} 的访问记录将被删除',
        }
    },
    en: {
        date: 'Date',
        host: 'Host Name',
        total: 'Run Time',
        focus: 'Browse Time',
        time: 'Visit Count',
        operation: {
            label: 'Operations',
            delete: 'Delete',
            add2Whitelist: 'Whitelist',
            removeFromWhitelist: 'Enable',
            archive: 'Archive',
            jumpToTrender: 'Trender',
            confirmMsg: 'OK',
            cancelMsg: 'NO!',
            deleteConfirmMsgAll: 'All records of {url} will be deleted',
            deleteConfirmMsgRange: 'Records of {url} from {start} to {end} will be deleted',
            deleteConfirmMsg: 'The record of {url} on {date} will be deleted'
        }
    },
    ja: {
        date: '日期',
        host: 'URL',
        total: '実行時間',
        focus: '閲覧時間',
        time: '訪問回数',
        operation: {
            label: '操作',
            delete: '削除',
            add2Whitelist: 'ホワイトリスト',
            removeFromWhitelist: '有効にする',
            archive: 'アーカイブ',
            jumpToTrender: '傾向',
            confirmMsg: 'OK',
            cancelMsg: 'キャンセル',
            deleteConfirmMsgAll: '{url} のすべての訪問記録が削除されます',
            deleteConfirmMsgRange: '{url} {start} から {end} までの訪問記録は削除されます',
            deleteConfirmMsg: '{date} の {url} の訪問記録は削除されます'
        }
    }
}

export default _default