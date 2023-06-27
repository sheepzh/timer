/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './content-script-resource.json'

export type ContentScriptMessage = {
    consoleLog: string
    closeAlert: string
    timeWithHour: string
    timeWithMinute: string
    timeWithSecond: string
    timeLimitMsg: string
    more5Minutes: string
}

const _default: Messages<ContentScriptMessage> = resource

export default _default