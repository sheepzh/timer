import { Messages } from "../../../util/i18n"

export type OptionMessage = {
    yes: string
    no: string
    popup: {
        title: string
        max: string
        type: string
    }
    additional: {
        title: string
        displayWhitelist: string
        whitelistItem: string
        contextMenu: string
    }
    resetButton: string
    resetSuccess: string
    defaultValue: string
}

const _default: Messages<OptionMessage> = {
    zh_CN: {
        yes: '是',
        no: '否',
        popup: {
            title: '今日数据',
            max: '只显示前 {input} 条今日数据，剩下的条目合并显示',
            type: '打开时显示 {input}'
        },
        additional: {
            title: '附加功能',
            displayWhitelist: '{input}  是否在 {contextMenu} 里，显示 {whitelist} 相关功能',
            whitelistItem: '白名单',
            contextMenu: '浏览器的右键菜单'
        },
        resetButton: '恢复默认',
        resetSuccess: '成功重置为默认值',
        defaultValue: '默认值： {default}'
    },
    en: {
        yes: 'Yes',
        no: 'No',
        popup: {
            title: 'Today\'s Data',
            max: 'Show the first {input} data items of today',
            type: 'Show {input} when opened'
        },
        additional: {
            title: 'Additional Functions',
            displayWhitelist: '{input}  Whether to display {whitelist} in {contextMenu}',
            whitelistItem: 'the whitelist item',
            contextMenu: 'the context menu'
        },
        resetButton: 'Reset',
        resetSuccess: 'Reset to default successfully!',
        defaultValue: 'Default: {default}'
    },
    ja: {
        yes: 'はい',
        no: 'いいえ',
        popup: {
            title: '今日のデータ',
            max: '今日のデータは、最初の {input} データを示しています',
            type: '開くと {input} が表示されます'
        },
        additional: {
            title: 'その他の機能',
            // Not translated no
            displayWhitelist: '{input}  Whether to display {whitelist} in {contextMenu}',
            whitelistItem: 'the whitelist item',
            contextMenu: 'the context menu'
        },
        resetButton: 'リセット',
        resetSuccess: 'デフォルトに正常にリセット',
        defaultValue: 'デフォルト値：{default}'
    }
}

export default _default