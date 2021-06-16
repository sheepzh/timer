import TimerDatabase from "./database/timer-database"
import WastePerDay from "./entity/dao/waste-per-day"
import timeService from './service/timer-service'
import whitelistService from "./service/whitelist-service"
import { formatPeriod } from "./util/time"

const timerDatabase = new TimerDatabase(chrome.storage.local)
const host = document.location.host

timeService.addOneTime(host)

whitelistService.include(host)
    .then(including => {
        if (including) return

        const hourMsg = chrome.i18n.getMessage('message_timeWithHour')
        const minuteMsg = chrome.i18n.getMessage('message_timeWithMinute')
        const secondMsg = chrome.i18n.getMessage('message_timeWithSecond')
        timerDatabase
            .get(host, new Date())
            .then((waste: WastePerDay) => {
                const info0 = chrome.i18n.getMessage('message_openTimesConsoleLog')
                    .replace('{time}', waste.time ? '' + waste.time : '-')
                    .replace('{host}', host)
                const info1 = chrome.i18n.getMessage('message_usedTimeInConsoleLog')
                    .replace('{focus}', formatPeriod(waste.focus, hourMsg, minuteMsg, secondMsg))
                    .replace('{total}', formatPeriod(waste.total, hourMsg, minuteMsg, secondMsg))
                console.log(info0)
                console.log(info1)
            })
    })
