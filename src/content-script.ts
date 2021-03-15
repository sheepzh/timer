import timerDatabase, { WastePerDay } from "./database/timer-database"
import timeService from './service/timer-service'
import { FOCUS, SAVE_FOCUS, UNFOCUS } from "./util/constant"
import { formatPeriod } from "./util/time"

const host = document.location.host
chrome.runtime.sendMessage({ code: 'hostStart', host })

// init
timerDatabase.refresh(() => {
    timeService.addOneTime(host)
    const hourMsg = chrome.i18n.getMessage('message_timeWithHour')
    const minuteMsg = chrome.i18n.getMessage('message_timeWithMinute')
    const secondMsg = chrome.i18n.getMessage('message_timeWithSecond')
    timerDatabase.get(host, new Date(), (waste: WastePerDay) => {
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

let focusStart: number = new Date().getTime()

function saveFocus() {
    focusStart !== undefined && chrome.runtime.sendMessage({ code: SAVE_FOCUS, host, focusStart })
    focusStart = undefined
}

window.addEventListener('load', () => {
    function listener(obj: { code: string }, _: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
        const { code } = obj
        if (code === FOCUS) {
            focusStart = new Date().getTime()
        } else if (code === UNFOCUS) {
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
