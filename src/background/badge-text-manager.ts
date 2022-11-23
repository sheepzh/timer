/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimerDatabase from "@db/timer-database"
import optionService from "@service/option-service"
import { extractHostname, isBrowserUrl } from "@util/pattern"

const storage = chrome.storage.local
const timerDb: TimerDatabase = new TimerDatabase(storage)

export type BadgeLocation = {
    /**
     * The tab id of badge text show display with
     */
    tabId: number
    /**
     * The host to gain the focus time, can be undefined or null
     */
    host: string
}

function mill2Str(milliseconds: number) {
    if (milliseconds < 60000) {
        // no more than 1 minutes
        return `${Math.round(milliseconds / 1000)}s`
    } else if (milliseconds < 3600000) {
        // no more than 1 hour
        return `${Math.round(milliseconds / 60000)}m`
    } else {
        return `${(milliseconds / 3600000).toFixed(1)}h`
    }
}

function setBadgeText(milliseconds: number | undefined, tabId: number | undefined) {
    const text = milliseconds === undefined ? '' : mill2Str(milliseconds)
    chrome.action.setBadgeText?.({ text, tabId })
}

function findFocusedWindow(): Promise<chrome.windows.Window> {
    return new Promise(resolve =>
        chrome.windows.getLastFocused(
            // Only find normal window
            { windowTypes: ['normal'] },
            window => resolve(window && window.focused ? window : undefined)
        )
    )
}

function findActiveTab(): Promise<BadgeLocation> {
    return new Promise(resolve => findFocusedWindow().then(window => {
        if (!window) {
            resolve(undefined)
            return
        }
        chrome.tabs.query({ active: true, windowId: window.id }, tabs => {
            // Fix #131
            // Edge will return two active tabs, including the new tab with url 'edge://newtab/', GG
            tabs = tabs.filter(tab => !isBrowserUrl(tab.url))
            if (!tabs || !tabs.length) {
                resolve(undefined)
            } else {
                const { url, id } = tabs[0]
                const host = extractHostname(url).host
                resolve({ tabId: id, host })
            }
        })
    }))
}

async function updateFocus(badgeLocation?: BadgeLocation) {
    badgeLocation = badgeLocation || await findActiveTab()
    if (!badgeLocation) {
        return
    }
    const { host, tabId } = badgeLocation
    const milliseconds = host ? (await timerDb.get(host, new Date())).focus : undefined
    setBadgeText(milliseconds, tabId)
}

const ALARM_NAME = 'timer-badge-text-manager-alarm'
const ALARM_INTERVAL = 1000
function createAlarm(beforeAction?: () => void) {
    beforeAction?.()
    chrome.alarms.create(ALARM_NAME, { when: Date.now() + ALARM_INTERVAL })
}

class BadgeTextManager {
    isPaused: boolean

    async init() {
        createAlarm()
        chrome.alarms.onAlarm.addListener(alarm => {
            if (ALARM_NAME === alarm.name) {
                createAlarm(() => !this.isPaused && updateFocus())
            }
        })

        const option: Partial<timer.option.AllOption> = await optionService.getAllOption()
        this.pauseOrResumeAccordingToOption(!!option.displayBadgeText)
        optionService.addOptionChangeListener(({ displayBadgeText }) => this.pauseOrResumeAccordingToOption(displayBadgeText))
    }

    /**
     * Hide the badge text
     */
    pause() {
        this.isPaused = true
        setBadgeText(undefined, undefined)
    }

    /**
     * Show the badge text
     */
    resume() {
        this.isPaused = false
        // Update badge text immediately
        this.forceUpdate()
    }

    forceUpdate(badgeLocation?: BadgeLocation) {
        if (this.isPaused) { return }
        updateFocus(badgeLocation)
    }

    private pauseOrResumeAccordingToOption(displayBadgeText: boolean) {
        displayBadgeText ? this.resume() : this.pause()
    }
}

export default new BadgeTextManager()
