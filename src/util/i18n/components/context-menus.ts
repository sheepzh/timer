import { Messages } from ".."

/**
 * Used for menu
 */
export type ContextMenusMessage = {
    add2Whitelist: string
    removeFromWhitelist: string
}

const _default: Messages<ContextMenusMessage> = {
    zh_CN: {
        add2Whitelist: '将{host}加入白名单',
        removeFromWhitelist: '将{host}从白名单移出'
    },
    en: {
        add2Whitelist: 'Add {host} to the whitelist',
        removeFromWhitelist: 'Remove {host} from the whitelist'
    },
    ja: {
        add2Whitelist: 'ホワイトリスト',
        removeFromWhitelist: 'ホワイトリストから削除する'
    }
}

export default _default