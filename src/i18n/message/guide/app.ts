/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './app-resource.json'

export type AppMessage = {
    title: string
    p1: string
    l1: string
    l2: string
    p2: string
}

const _default: Messages<AppMessage> = resource

export default _default