/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './site-manage-resource.json'

export type SiteManageMessage = {
    hostPlaceholder: string
    aliasPlaceholder: string
    onlyDetected: string
    deleteConfirmMsg: string
    column: {
        host: string
        type: string
        alias: string
        aliasInfo: string
        source: string
        icon: string
    }
    type: Record<'normal' | 'merged' | 'virtual', Record<'name' | 'info', string>>
    source: {
        user: string
        detected: string
    }
    button: {
        add: string
        delete: string
        save: string
    }
    form: {
        emptyAlias: string
        emptyHost: string
    }
    msg: {
        hostExistWarn: string
        saved: string
        existedTag: string
        mergedTag: string
        virtualTag: string
    }
}

const _default: Messages<SiteManageMessage> = resource

export default _default
