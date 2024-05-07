/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './footer-resource.json'

export type FooterMessage = {
    updateVersion: string
    updateVersionInfo: string
    updateVersionInfo4Firefox: string
    rate: string
}

const _default = resource as Messages<FooterMessage>

export default _default