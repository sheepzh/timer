/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './layout-resource.json'

export type LayoutMessage = {
    header: {
        sourceCode: string
        email: string
    }
    menu: {
        usage: string
    }
}

const _default: Messages<LayoutMessage> = resource

export default _default