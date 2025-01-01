/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { setBadgeBgColor, setBadgeText } from "@api/chrome/action"
import { listTabs } from "@api/chrome/tab"
import { getFocusedNormalWindow } from "@api/chrome/window"
import StatDatabase from "@db/stat-database"
import whitelistHolder from "@service/components/whitelist-holder"
import optionService from "@service/option-service"
import { extractHostname, isBrowserUrl } from "@util/pattern"
import { MILL_PER_HOUR, MILL_PER_MINUTE, MILL_PER_SECOND } from "@util/time"
import MessageDispatcher from "./message-dispatcher"

const statDatabase: StatDatabase = new StatDatabase(chrome.storage.local)

export type BadgeLocation = {
    /**
     * The tab id of badge text show display with
     */
    tabId: number
    /**
     * The url of tab
     */
    url: string
    focus?: number
}

function mill2Str(milliseconds: number) {
    if (milliseconds < MILL_PER_MINUTE) {
        // no more than 1 minutes
        return `${Math.round(milliseconds / MILL_PER_SECOND)}s`
    } else if (milliseconds < MILL_PER_HOUR) {
        // no more than 1 hour
        return `${Math.round(milliseconds / MILL_PER_MINUTE)}m`
    } else {
        return `${(milliseconds / MILL_PER_HOUR).toFixed(1)}h`
    }
}

function setBadgeTextOfMills(milliseconds: number | undefined, tabId: number | undefined) {
    const text = milliseconds === undefined ? '' : mill2Str(milliseconds)
    setBadgeText(text)
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

type BadgeState = 'HIDDEN' | 'NOT_SUPPORTED' | 'PAUSED' | 'TIME' | 'WHITELIST'

class BadgeManager {
    pausedTabId: number
    current: BadgeLocation
    visible: boolean
    state: BadgeState

    async init(messageDispatcher: MessageDispatcher) {
        const option: timer.option.AllOption = await optionService.getAllOption()
        this.processOption(option)
        optionService.addOptionChangeListener(opt => this.processOption(opt))
        whitelistHolder.addPostHandler(() => this.render())
        messageDispatcher
            .register('cs.idleChange', (isIdle, sender) => {
                const tabId = sender?.tab?.id
                isIdle ? this.pause(tabId) : this.resume(tabId)
            })
        this.updateFocus()
    }

    /**
     * Hide the badge text
     */
    private async pause(tabId?: number) {
        this.pausedTabId = tabId
        this.render()
    }

    /**
     * Show the badge text
     */
    private resume(tabId: number) {
        if (!this.pausedTabId || this.pausedTabId !== tabId) return
        this.pausedTabId = undefined
        this.render()
    }

    async updateFocus(target?: BadgeLocation) {
        this.current = target || await findActiveTab()
        await this.render()
    }

    private processOption(option: timer.option.AppearanceOption) {
        const { displayBadgeText, badgeBgColor } = option || {}
        this.visible = !!displayBadgeText
        this.render()
        setBadgeBgColor(badgeBgColor)
    }

    private async render(): Promise<void> {
        this.state = await this.processState()
    }

    private async processState(): Promise<BadgeState> {
        const { url, tabId, focus } = this.current || {}
        if (!this.visible || !url) {
            this.state !== 'HIDDEN' && setBadgeText('')
            return 'HIDDEN'
        }
        if (isBrowserUrl(url)) {
            this.state !== 'NOT_SUPPORTED' && setBadgeText('∅')
            return 'NOT_SUPPORTED'
        }
        const host = extractHostname(url)?.host
        if (whitelistHolder.contains(host, url)) {
            this.state !== 'WHITELIST' && setBadgeText('W')
            return 'WHITELIST'
        }
        if (this.pausedTabId === tabId) {
            this.state !== 'PAUSED' && setBadgeText('P')
            return 'PAUSED'
        }
        const milliseconds = focus || (host ? (await statDatabase.get(host, new Date())).focus : undefined)
        setBadgeTextOfMills(milliseconds, tabId)
        return 'TIME'
    }
}

export default new BadgeManager()
