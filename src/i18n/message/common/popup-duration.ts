/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './popup-duration-resource.json'

export type PopupDurationMessage = { [key in timer.option.PopupDuration]: string }

const _default: Messages<PopupDurationMessage> = resource

export default _default