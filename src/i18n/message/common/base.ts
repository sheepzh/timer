/**
 * Copyright (c) 2021-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './base-resource.json'

export type BaseMessage = {
    currentVersion: string
    allFunction: string
    guidePage: string
}

/**
 * Use for chrome
 */
const _default: Messages<BaseMessage> = resource

export default _default