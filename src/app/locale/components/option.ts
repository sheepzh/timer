import { Messages } from "../../../util/i18n"

export type OptionMessage = {
    popup: {
        title: string
        max: string
        type: string
    }
    resetButton: string
    resetSuccess: string
    defaultValue: string
}

const _default: Messages<OptionMessage> = {
    zh_CN: {
        popup: {
            title: '今日数据',
            max: '只显示前 {input} 条今日数据，剩下的条目合并显示',
            type: '打开时显示 {input}'
        },
        resetButton: '恢复默认',
        resetSuccess: '成功重置为默认值',
        defaultValue: '默认值： {default}'
    },
    en: {
        popup: {
            title: 'Today\'s Data',
            max: 'Show the first {input} data items of today',
            type: 'Show {input} when opened'
        },
        resetButton: 'Reset',
        resetSuccess: 'Reset to default successfully!',
        defaultValue: 'Default: {default}'
    },
    ja: {
        popup: {
            title: '今日のデータ',
            max: '今日のデータは、最初の {input} データを示しています',
            type: '開くと {input} が表示されます'
        },
        resetButton: 'リセット',
        resetSuccess: 'デフォルトに正常にリセット',
        defaultValue: 'デフォルト値：{default}'
    }
}

export default _default