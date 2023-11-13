/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { handleError } from "./common"

export function getTab(id: number): Promise<ChromeTab> {
    return new Promise(resolve => chrome.tabs.get(id, tab => {
        handleError("getTab")
        resolve(tab)
    }))
}

export function getCurrentTab(): Promise<ChromeTab> {
    return new Promise(resolve => chrome.tabs.getCurrent(tab => {
        handleError("getCurrentTab")
        resolve(tab)
    }))
}

export function createTab(param: chrome.tabs.CreateProperties | string): Promise<ChromeTab> {
    const prop: chrome.tabs.CreateProperties = typeof param === 'string' ? { url: param } : param
    return new Promise(resolve => chrome.tabs.create(prop, tab => {
        handleError("getTab")
        resolve(tab)
    }))
}

/**
 * Create one tab after current tab.
 * 
 * Must not be invocked in background.js
 */
export async function createTabAfterCurrent(url: string): Promise<ChromeTab> {
    const tab = await getCurrentTab()
    if (!tab) {
        // Current tab not found
        return createTab(url)
    } else {
        const { windowId, index: currentIndex } = tab
        return createTab({
            url,
            windowId,
            index: (currentIndex ?? -1) + 1
        })
    }
}

export function listTabs(query?: chrome.tabs.QueryInfo): Promise<ChromeTab[]> {
    query = query || {}
    return new Promise(resolve => chrome.tabs.query(query, tabs => {
        handleError("listTabs")
        resolve(tabs || [])
    }))
}

export function sendMsg2Tab<T = any, R = any>(tabId: number, code: timer.mq.ReqCode, data: T): Promise<R> {
    const request: timer.mq.Request<T> = { code, data }
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage<timer.mq.Request<T>, timer.mq.Response>(tabId, request, response => {
            handleError('sendMsg2Tab')
            const resCode = response?.code
            resCode === 'success' && resolve(response.data)
            resCode === "fail" && reject(new Error(response?.msg))
        })
    })
}

type TabHandler<Event> = (tabId: number, ev: Event, tab?: ChromeTab) => void

export function onTabActivated(handler: TabHandler<ChromeTabActiveInfo>): void {
    chrome.tabs.onActivated.addListener((activeInfo: chrome.tabs.TabActiveInfo) => {
        handleError("tabActivated")
        handler(activeInfo?.tabId, activeInfo)
    })
}

export function onTabUpdated(handler: TabHandler<ChromeTabChangeInfo>): void {
    chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: ChromeTabChangeInfo, tab: ChromeTab) => {
        handleError("tabUpdated")
        handler(tabId, changeInfo, tab)
    })
}