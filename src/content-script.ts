import TimerDatabase from "./database/timer-database"
import WastePerDay from "./entity/dao/waste-per-day"
import timeService from './service/timer-service'
import whitelistService from "./service/whitelist-service"
import { t2Chrome } from "./util/i18n/chrome/t"
import { formatPeriod } from "./util/time"

const timerDatabase = new TimerDatabase(chrome.storage.local)
const host = document.location.host

/**
 * Print info of today
 */
async function printInfo() {
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

async function main() {
    if (!host) return

    const isWhitelist = await whitelistService.include(host)
    if (isWhitelist) return

    timeService.addOneTime(host)
    printInfo()
}

main()