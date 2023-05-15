/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './confirm-resource.json'

export type ConfirmMessage = {
    confirmMsg: string,
    cancelMsg: string
}

const _default: Messages<ConfirmMessage> = resource

export default _default