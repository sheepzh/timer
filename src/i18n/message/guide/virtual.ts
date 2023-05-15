/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './virtual-resource.json'

export type VirtualMessage = {
    title: string
    p1: string
    step: {
        title: string
        enter: string
        click: string
        form: string
        browse: string
    }
}

const _default: Messages<VirtualMessage> = resource

export default _default
