import timerDatabase from "./database/timer-database"
import WastePerDay from "./entity/dao/waste-per-day"
import timeService from './service/timer-service'
import whitelistService from "./service/whitelist-service"
import { SAVE_FOCUS, HOST_START, UNFOCUS } from "./util/constant/message-tag"
import { formatPeriod } from "./util/time"

const host = document.location.host

// init
timerDatabase
    .refresh()
    .then(() => whitelistService
        .include(host)
        .then(including => {
            if (including) {
                return
            }
            timeService.addOneTime(host)
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
    )

// let focusStart: number = new Date().getTime()
function saveFocus() {
    chrome.runtime.sendMessage({ code: SAVE_FOCUS, host })
    // focusStart = undefined
}

window.addEventListener('load', () => {
    chrome.runtime.sendMessage({ code: HOST_START, host })
    function listener(obj: { code: string }, _: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
        const { code } = obj
        if (code === UNFOCUS) {
            saveFocus()
        }
        sendResponse("ok")
    }
    chrome.runtime.onMessage.addListener(listener)

    window.addEventListener('beforeunload', () => {
        saveFocus()
        chrome.runtime.onMessage.removeListener(listener)
    })
})
