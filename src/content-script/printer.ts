/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { sendMsg2Runtime } from "@api/chrome/runtime"
import { formatPeriodCommon } from "@util/time"
import { t } from "./locale"

/**
 * Print info of today
 */
export default async function printInfo(host: string) {
    const waste: timer.core.Result = await sendMsg2Runtime('cs.getTodayInfo', host)

    const param = {
        time: waste.time ? '' + waste.time : '-',
        focus: formatPeriodCommon(waste.focus),
        host,
    }
    const info0 = t(msg => msg.console.consoleLog, param)
    const info1 = t(msg => msg.console.closeAlert, { appName: t(msg => msg.meta.name) })
    console.log(info0)
    console.log(info1)
}