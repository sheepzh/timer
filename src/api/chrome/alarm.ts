import { handleError } from "./common"

type AlarmHandler = (alarm: ChromeAlarm) => PromiseLike<void> | void

export function onAlarm(handler: AlarmHandler) {
    chrome.alarms.onAlarm.addListener(handler)
}

export function clearAlarm(name: string): Promise<void> {
    return new Promise(resolve => chrome.alarms.clear(name, () => {
        handleError('clearAlarm')
        resolve()
    }))
}

export function createAlarm(name: string, when: number): void {
    chrome.alarms.create(name, { when })
}