import TimerDatabase from "../database/timer-database"
import WastePerDay from "../entity/dao/waste-per-day"
import { t2Chrome } from "../util/i18n/chrome/t"
import { formatPeriod } from "../util/time"

const timerDatabase = new TimerDatabase(chrome.storage.local)

/**
 * Print info of today
 */
export default async function printInfo(host: string) {
    const waste: WastePerDay = await timerDatabase.get(host, new Date())
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
    console.log(info0)
    console.log(info1)
}