/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "./locale"
import { formatPeriod } from "@util/time"
import { sendMsg2Runtime } from "@api/chrome/runtime"

/**
 * Print info of today
 */
export default async function printInfo(host: string) {
    const waste: timer.stat.Result = await sendMsg2Runtime('cs.getTodayInfo', host)
    const hourMsg = t(msg => msg.console.timeWithHour)
    const minuteMsg = t(msg => msg.console.timeWithMinute)
    const secondMsg = t(msg => msg.console.timeWithSecond)

    const msg = { hourMsg, minuteMsg, secondMsg }

    const param = {
        time: waste.time ? '' + waste.time : '-',
        focus: formatPeriod(waste.focus, msg),
        host,
    }
    const info0 = t(msg => msg.console.consoleLog, param)
    const info1 = t(msg => msg.console.closeAlert, { appName: t(msg => msg.meta.name) })
    console.log(info0)
    console.log(info1)
}