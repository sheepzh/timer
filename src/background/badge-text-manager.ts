/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimerDatabase from "@db/timer-database"
import whitelistHolder from "@service/components/whitelist-holder"
import optionService from "@service/option-service"
import { IS_MV3 } from "@util/constant/environment"
import { extractHostname, isBrowserUrl } from "@util/pattern"

const storage = chrome.storage.local
const timerDb: TimerDatabase = new TimerDatabase(storage)

export type BadgeLocation = {
    /**
     * The tab id of badge text show display with
     */
    tabId: number
    /**
     * The url of tab
     */
    url: string
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

function setBadgeTextOfMills(milliseconds: number | undefined, tabId: number | undefined) {
    const text = milliseconds === undefined ? '' : mill2Str(milliseconds)
    setBadgeText(text, tabId)
}

function setBadgeText(text: string, tabId: number | undefined) {
    // mv3 use chrome.action
    // mv2 use chrome.browserAction
    const action = IS_MV3 ? chrome.action : chrome.browserAction
    action?.setBadgeText?.({ text, tabId })
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
                resolve({ tabId: id, url })
            }
        })
    }))
}

async function updateFocus(badgeLocation?: BadgeLocation, lastLocation?: BadgeLocation): Promise<BadgeLocation> {
    // Clear the last tab firstly
    lastLocation?.tabId && setBadgeText('', lastLocation.tabId)
    badgeLocation = badgeLocation || await findActiveTab()
    if (!badgeLocation) {
        return badgeLocation
    }
    const { url, tabId } = badgeLocation
    if (!url || isBrowserUrl(url)) {
        return badgeLocation
    }
    const host = extractHostname(url)?.host
    if (whitelistHolder.contains(host)) {
        setBadgeText('W', tabId)
        return badgeLocation
    }
    const milliseconds = host ? (await timerDb.get(host, new Date())).focus : undefined
    setBadgeTextOfMills(milliseconds, tabId)
    return badgeLocation
}

const ALARM_NAME = 'timer-badge-text-manager-alarm'
const ALARM_INTERVAL = 1000
function createAlarm(beforeAction?: () => void) {
    beforeAction?.()
    chrome.alarms.create(ALARM_NAME, { when: Date.now() + ALARM_INTERVAL })
}

class BadgeTextManager {
    isPaused: boolean
    lastLocation: BadgeLocation

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
        whitelistHolder.addPostHandler(updateFocus)
    }

    /**
     * Hide the badge text
     */
    async pause() {
        this.isPaused = true
        const tab = await findActiveTab()
        setBadgeText('P', tab?.tabId)
    }

    /**
     * Show the badge text
     */
    resume() {
        this.isPaused = false
        // Update badge text immediately
        this.forceUpdate()
    }

    async forceUpdate(badgeLocation?: BadgeLocation) {
        if (this.isPaused) { return }
        this.lastLocation = await updateFocus(badgeLocation, this.lastLocation)
    }

    private pauseOrResumeAccordingToOption(displayBadgeText: boolean) {
        displayBadgeText ? this.resume() : this.pause()
    }
}

export default new BadgeTextManager()
