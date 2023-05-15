/**
 * Copyright (c) 2023-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './home-resource.json'

type _Key =
    | 'desc'
    | 'button'
    | 'download'

export type HomeMessage = {
    [key in _Key]: string
}

const _default: Messages<HomeMessage> = resource

export default _default
