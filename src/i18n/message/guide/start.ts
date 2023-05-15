/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './start-resource.json'

type _Key =
    | 'p1'
    | 's1'
    | 's1p1'
    | 's2'
    | 's2p1'
    | 's3'
    | 's3p1'
    | 'alert'

export type StartMessage = {
    title: string
} & {
        [key in _Key]: string
    }

const _default: Messages<StartMessage> = resource

export default _default