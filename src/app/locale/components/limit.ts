import { Messages } from "../../../util/i18n"

export type LimitMessage = {
    conditionFilter: string
    filterDisabled: string
    item: {
        condition: string
        time: string
        enabled: string
        waste: string
        operation: string
    },
    button: {
        add: string
        test: string
        paste: string
        save: string
        delete: string
    },
    addTitle: string
    useWildcard: string
    timeUnit: {
        hour: string
        minute: string
        second: string
    }
    message: {
        noUrl: string
        noTime: string
        saved: string
        deleteConfirm: string
        deleted: string
    }
}

const _default: Messages<LimitMessage> = {
    zh_CN: {
        conditionFilter: '输入网址，然后回车',
        filterDisabled: '过滤无效规则',
        item: {
            condition: '限制网址',
            time: '每日限制时长',
            waste: '今日浏览时长',
            enabled: '是否有效',
            operation: '操作'
        },
        button: {
            add: '新增',
            test: '网址测试',
            paste: '粘贴',
            save: '保存',
            delete: '删除'
        },
        addTitle: '新增限制',
        useWildcard: '是否使用通配符',
        timeUnit: {
            hour: '小时',
            minute: '分钟',
            second: '秒'
        },
        message: {
            saved: '保存成功',
            noUrl: '未填写限制网址',
            noTime: '未填写每日限制时长',
            deleteConfirm: '是否删除限制：{cond}？',
            deleted: '删除成功'
        }
    },
    en: {
        conditionFilter: 'URL',
        filterDisabled: 'Only Enabled',
        item: {
            condition: 'Limitted URL',
            time: 'Limitted time per day',
            waste: 'Browsed today',
            enabled: 'Enabled',
            operation: 'Operations'
        },
        button: {
            add: 'New',
            test: 'Test URL',
            paste: 'Paste',
            save: 'Download',
            delete: 'Delete'
        },
        addTitle: 'New',
        useWildcard: 'Whether to use wildcard',
        timeUnit: {
            hour: 'Hours',
            minute: 'Minutes',
            second: 'Seconds'
        },
        message: {
            saved: 'Saved successfully',
            noUrl: 'Unfilled limitted URL',
            noTime: 'Unfilled limitted time per day',
            deleteConfirm: 'Do you want to delete the rule of {cond}?',
            deleted: 'Deleted successfully'
        }
    },
    ja: {
        conditionFilter: 'URL',
        filterDisabled: '有效',
        item: {
            condition: '制限 URL',
            waste: '今日の時間を閲覧する',
            time: '1日あたりの制限',
            enabled: '有效',
            operation: '操作'
        },
        button: {
            add: '新增',
            test: 'テストURL',
            paste: 'ペースト',
            save: 'セーブ',
            delete: '削除'
        },
        addTitle: '新增',
        useWildcard: 'ワイルドカードを使用するかどうか',
        timeUnit: {
            hour: '時間',
            minute: '分',
            second: '秒'
        },
        message: {
            noUrl: '埋められていない制限URL',
            noTime: '1日の制限時間を記入しない',
            saved: '正常に保存',
            deleteConfirm: '{cond} の制限を削除しますか？',
            deleted: '正常に削除'
        }
    }
}

export default _default