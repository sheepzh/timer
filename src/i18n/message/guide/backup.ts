/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './backup-resource.json'

export type BackupMessage = {
    title: String
    p1: string
    upload: {
        title: string
        prepareToken: string
        enter: string
        form: string
        backup: string
    }
    query: {
        title: string
        p1: string
        enter: string
        enable: string
        wait: string
        tip: string
    }
}

const _default: Messages<BackupMessage> = resource

export default _default
