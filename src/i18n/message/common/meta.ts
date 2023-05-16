/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './meta-resource.json'

export type MetaMessage = {
    name: string
    marketName: string
    description: string
    slogan: string
}

const _default: Messages<MetaMessage> = resource

export default _default