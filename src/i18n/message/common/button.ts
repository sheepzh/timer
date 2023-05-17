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
    paste: string
    confirm: string
    cancel: string
    okey: string
    dont: string
}

export default resource as Messages<ButtonMessage>