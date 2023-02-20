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
    const hourMsg = t(msg => msg.timeWithHour)
    const minuteMsg = t(msg => msg.timeWithMinute)
    const secondMsg = t(msg => msg.timeWithSecond)

    const msg = { hourMsg, minuteMsg, secondMsg }

    const info0 = t(msg => msg.consoleLog)
        .replace('{time}', waste.time ? '' + waste.time : '-')
        .replace('{focus}', formatPeriod(waste.focus, msg))
        .replace('{host}', host)
    const info1 = t(msg => msg.closeAlert)
    console.log(info0)
    console.log(info1)
}