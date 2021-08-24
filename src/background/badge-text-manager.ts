import OptionDatabase from "../database/option-database"
import TimerDatabase from "../database/timer-database"
import { extractHostname } from "../util/pattern"

const storage = chrome.storage.local
const timerDb: TimerDatabase = new TimerDatabase(storage)
const optionDb: OptionDatabase = new OptionDatabase(storage)

function mill2Str(milliseconds: number) {
    if (milliseconds < 60000) {
        return `${Math.round(milliseconds / 1000)}s`
    } else {
        return `${Math.round(milliseconds / 60000)}m`
    }
}

function setBadgeText(milliseconds: number | undefined) {
    console.log('mills', milliseconds)
    const text = milliseconds === undefined ? '' : mill2Str(milliseconds)
    chrome.browserAction
        && chrome.browserAction.setBadgeText
        && chrome.browserAction.setBadgeText({ text })
}

async function findActiveHost(): Promise<string> {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true }, tabs => {
            if (!tabs || !tabs.length) { resolve(undefined) }
            const { url } = tabs[0]
            const host = extractHostname(url).host
            resolve(host)
        })
    })
}

async function updateFocus(host?: string) {
    if (!host) {
        host = await findActiveHost()
    }
    const milliseconds = host ? (await timerDb.get(host, new Date)).focus : undefined
    setBadgeText(milliseconds)
}

class BadgeTextManager {
    timer: NodeJS.Timer
    isPaused: boolean

    async init() {
        this.timer = setInterval(() => !this.isPaused && updateFocus(), 1000)

        const option: Partial<Timer.Option> = await optionDb.getOption()
        this.pauseOrResumeAccordingToOption(!!option.displayBadgeText)
        optionDb.addOptionChangeListener(({ displayBadgeText }) => this.pauseOrResumeAccordingToOption(displayBadgeText))
    }

    /**
     * Hide the badge text
     */
    pause() {
        this.isPaused = true
        setBadgeText(undefined)
    }

    /**
     * Show the badge text
     */
    resume() {
        this.isPaused = false
        // Update badge text immediately
        this.forceUpdate()
    }

    forceUpdate(host?: string) {
        if (this.isPaused) { return }
        host ? updateFocus(host) : setBadgeText(undefined)
    }

    private pauseOrResumeAccordingToOption(displayBadgeText: boolean) {
        displayBadgeText ? this.resume() : this.pause()
    }
}

export default new BadgeTextManager()