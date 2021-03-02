import database, { WastePerDay } from "./database"
import { FOCUS, HOST_END, SAVE_FOCUS, UNFOCUS } from "./util/constant"
import { formatSpec } from "./util/time"

const host = document.location.host
chrome.runtime.sendMessage({ code: 'hostStart', host })

// init
database.refresh(() => {
    database.addOneTime(host)
    const waste: WastePerDay = database.getTodayOf(host)

    const info0 = chrome.i18n.getMessage('message_openTimesConsoleLog')
        .replace('{host}', host)
        .replace('{time}', waste.time.toString())
    console.log(info0)
    const info1 = chrome.i18n.getMessage('message_usedTimeInConsoleLog')
        .replace('{focus}', formatSpec(waste.focus))
        .replace('{total}', formatSpec(waste.total))
    console.log(info1)
})


let focusStart: number = new Date().getTime()

window.onload = () => {
    function saveFocus() {
        const now = new Date().getTime()
        focusStart !== undefined && chrome.runtime.sendMessage({ code: SAVE_FOCUS, host, focus: now - focusStart })
        focusStart = undefined
    }
    function listener(obj) {
        const { code } = obj
        if (code === FOCUS) {
            focusStart = new Date().getTime()
        } else if (code === UNFOCUS) {
            saveFocus()
        }
    }
    chrome.runtime.onMessage.addListener(listener)
    window.onunload = () => {
        saveFocus()
        chrome.runtime.sendMessage({ code: HOST_END, host })
        chrome.runtime.onMessage.removeListener(listener)
    }
}
