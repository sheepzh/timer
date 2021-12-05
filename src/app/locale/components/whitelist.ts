/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Messages } from "../../../util/i18n"
export type WhitelistMessage = {
    addConfirmMsg: string
    removeConfirmMsg: string
    duplicateMsg: string
    infoAlertTitle: string
    infoAlert0: string
    infoAlert1: string
    placeholder: string
}

const _default: Messages<WhitelistMessage> = {
    zh_CN: {
        addConfirmMsg: '{url} 加入白名单后，将不再统计该网站的数据',
        removeConfirmMsg: '{url} 将从白名单中移除',
        duplicateMsg: '已存在白名单中',
        infoAlertTitle: '你可以在这里配置网站白名单',
        infoAlert0: '白名单内网站的上网时长和打开次数不会被统计',
        infoAlert1: '白名单内网站的上网时间也不会被限制',
        placeholder: '域名'
    },
    en: {
        addConfirmMsg: '{url} won\'t be counted after added into the whitelist any more.',
        removeConfirmMsg: '{url} will be removed from the whitelist.',
        duplicateMsg: 'Duplicated',
        infoAlertTitle: 'You can set the whitelist of site in this page',
        infoAlert0: 'Sites in the whitelist will not be counted',
        infoAlert1: 'Sites in the whitelist will not be limited',
        placeholder: 'Site'
    },
    ja: {
        addConfirmMsg: '{url} がホワイトリストに追加されると、このWebサイトの統計はカウントされなくなります。',
        removeConfirmMsg: '{url} はホワイトリストから削除されます',
        duplicateMsg: '繰り返される',
        infoAlertTitle: 'You can set the whitelist of site in this page',
        infoAlert0: 'Sites in the whitelist will not be counted.',
        infoAlert1: 'Sites in the whitelist will not be limited.',
        placeholder: 'URL'
    }
}

export default _default