/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './button-resource.json'

export type ButtonMessage = {
    create: string
    delete: string
    modify: string
    save: string
    test: string
    confirm: string
    cancel: string
    previous: string
    next: string
    okey: string
    dont: string
    operation: string
}

const _default: Messages<ButtonMessage> = resource

export default _default