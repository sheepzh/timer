/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "./locale"
import { formatPeriod } from "@util/time"

function getTodayInfo(host: string): Promise<timer.stat.Result> {
    const request: timer.mq.Request<string> = {
        code: 'cs.getTodayInfo',
        data: host
    }
    return new Promise(resolve => chrome.runtime.sendMessage(
        request,
        (res: timer.mq.Response<timer.stat.Result>) => resolve(res?.code === 'success' ? res.data : undefined)
    ))
}

/**
 * Print info of today
 */
export default async function printInfo(host: string) {
    const waste: timer.stat.Result = await getTodayInfo(host)
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