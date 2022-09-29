/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t2Chrome } from "@util/i18n/chrome/t"
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
    const hourMsg = t2Chrome(root => root.message.timeWithHour)
    const minuteMsg = t2Chrome(root => root.message.timeWithMinute)
    const secondMsg = t2Chrome(root => root.message.timeWithSecond)

    const msg = { hourMsg, minuteMsg, secondMsg }

    const info0 = t2Chrome(root => root.message.openTimesConsoleLog)
        .replace('{time}', waste.time ? '' + waste.time : '-')
        .replace('{host}', host)
    const info1 = t2Chrome(root => root.message.usedTimeInConsoleLog)
        .replace('{focus}', formatPeriod(waste.focus, msg))
        .replace('{total}', formatPeriod(waste.total, msg))
    const info2 = t2Chrome(root => root.message.closeAlert)
    console.log(info0)
    console.log(info1)
    console.log(info2)
}