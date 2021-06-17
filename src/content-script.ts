import TimerDatabase from "./database/timer-database"
import WastePerDay from "./entity/dao/waste-per-day"
import timeService from './service/timer-service'
import whitelistService from "./service/whitelist-service"
import { t2Chrome } from "./util/i18n/chrome/t"
import { formatPeriod } from "./util/time"

const timerDatabase = new TimerDatabase(chrome.storage.local)
const host = document.location.host

host && timeService.addOneTime(host)

host && whitelistService.include(host)
    .then(including => {
        if (including) return

        const hourMsg = t2Chrome(root => root.message.timeWithHour)
        const minuteMsg = t2Chrome(root => root.message.timeWithMinute)
        const secondMsg = t2Chrome(root => root.message.timeWithSecond)
        timerDatabase
            .get(host, new Date())
            .then((waste: WastePerDay) => {
                const info0 = t2Chrome(root => root.message.openTimesConsoleLog)
                    .replace('{time}', waste.time ? '' + waste.time : '-')
                    .replace('{host}', host)
                const info1 = t2Chrome(root => root.message.usedTimeInConsoleLog)
                    .replace('{focus}', formatPeriod(waste.focus, hourMsg, minuteMsg, secondMsg))
                    .replace('{total}', formatPeriod(waste.total, hourMsg, minuteMsg, secondMsg))
                console.log(info0)
                console.log(info1)
            })
    })