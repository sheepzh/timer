/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './limit-resource.json'

export type LimitMessage = {
    title: string
    p1: string
    step: {
        title: string
        enter: string
        click: string
        form: string
        check: string
    }
}

const _default: Messages<LimitMessage> = resource

export default _default
