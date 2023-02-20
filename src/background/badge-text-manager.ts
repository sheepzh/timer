/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { setBadgeText } from "@api/chrome/action"
import { listTabs } from "@api/chrome/tab"
import { getFocusedNormalWindow } from "@api/chrome/window"
import TimerDatabase from "@db/timer-database"
import whitelistHolder from "@service/components/whitelist-holder"
import optionService from "@service/option-service"
import { extractHostname, isBrowserUrl } from "@util/pattern"
import alarmManager from "./alarm-manager"

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

async function findActiveTab(): Promise<BadgeLocation> {
    const window = await getFocusedNormalWindow()
    if (!window) {
        return undefined
    }
    const tabs = await listTabs({ active: true, windowId: window.id })
    // Fix #131
    // Edge will return two active tabs, including the new tab with url 'edge://newtab/', GG
    const tab = tabs.filter(tab => !isBrowserUrl(tab?.url))[0]
    if (!tab) {
        return undefined
    }
    return { tabId: tab.id, url: tab.url }
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

class BadgeTextManager {
    isPaused: boolean
    lastLocation: BadgeLocation

    async init() {
        const option: Partial<timer.option.AllOption> = await optionService.getAllOption()
        this.pauseOrResumeAccordingToOption(!!option.displayBadgeText)
        optionService.addOptionChangeListener(({ displayBadgeText }) => this.pauseOrResumeAccordingToOption(displayBadgeText))
        whitelistHolder.addPostHandler(updateFocus)

        alarmManager.setInterval('badage-text-manager', 1000, () => !this.isPaused && updateFocus())
    }

    /**
     * Hide the badge text
     */
    async pause() {
        this.isPaused = true
        const tab = await findActiveTab()
        setBadgeText('', tab?.tabId)
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
