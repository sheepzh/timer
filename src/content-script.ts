import database, { WastePerDay } from "./database"
import { FOCUS, HOST_END, SAVE_FOCUS, UNFOCUS } from "./util/constant"
import { formatPeriod } from "./util/time"

const host = document.location.host
chrome.runtime.sendMessage({ code: 'hostStart', host })

// init
database.refresh(() => {
    database.addOneTime(host)
    const waste: WastePerDay = database.getTodayOf(host)

    // Bug exists while collecting 
    // const info0 = chrome.i18n.getMessage('message_openTimesConsoleLog')
    //     .replace('{host}', host)
    //     .replace('{time}', waste.time.toString())
    // console.log(info0)

    const hourMsg = chrome.i18n.getMessage('message_timeWithHour')
    const minuteMsg = chrome.i18n.getMessage('message_timeWithMinute')
    const secondMsg = chrome.i18n.getMessage('message_timeWithSecond')

    const info1 = chrome.i18n.getMessage('message_usedTimeInConsoleLog')
        .replace('{focus}', formatPeriod(waste.focus, hourMsg, minuteMsg, secondMsg))
        .replace('{total}', formatPeriod(waste.total, hourMsg, minuteMsg, secondMsg))
    console.log(info1)
})

let focusStart: number = new Date().getTime()

function saveFocus() {
    const now = new Date().getTime()
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
        chrome.runtime.sendMessage({ code: HOST_END, host })
        chrome.runtime.onMessage.removeListener(listener)
    })
})
