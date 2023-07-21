/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './item-resource.json'

export type ItemMessage = {
    date: string
    host: string
    focus: string
    time: string
    operation: {
        label: string
        delete: string
        add2Whitelist: string
        removeFromWhitelist: string
        deleteConfirmMsgAll: string
        deleteConfirmMsgRange: string
        deleteConfirmMsg: string
        analysis: string
        exportWholeData: string
        importWholeData: string
        importOtherData: string
    }
}

const _default: Messages<ItemMessage> = resource

export default _default
