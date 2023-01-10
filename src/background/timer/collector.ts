/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { isBrowserUrl, extractHostname, extractFileHost } from "@util/pattern"
import CollectionContext from "./collection-context"
import optionService from "@service/option-service"

let countLocalFiles: boolean
optionService.getAllOption().then(option => countLocalFiles = !!option.countLocalFiles)
optionService.addOptionChangeListener((newVal => countLocalFiles = !!newVal.countLocalFiles))

function queryAllWindows(): Promise<chrome.windows.Window[]> {
    return new Promise(resolve => chrome.windows.getAll(resolve))
}

function queryAllTabs(windowId: number): Promise<chrome.tabs.Tab[]> {
    return new Promise(resolve => chrome.tabs.query({ windowId }, resolve))
}

function handleTab(tab: chrome.tabs.Tab, window: chrome.windows.Window, context: CollectionContext) {
    if (!tab.active || !window.focused) {
        return
    }
    const url = tab.url
    if (!url) return
    if (isBrowserUrl(url)) return
    let host = extractHostname(url).host
    if (!host && countLocalFiles) {
        // Not host, try to detect the local files
        host = extractFileHost(url)
    }
    if (host) {
        context.accumulate(host, url)
    } else {
        console.log('Detect blank host:', url)
    }
}

async function doCollect(context: CollectionContext) {
    const windows = await queryAllWindows()
    for (const window of windows) {
        const tabs = await queryAllTabs(window.id)
        // tabs maybe undefined
        if (!tabs) {
            continue
        }
        tabs.forEach(tab => handleTab(tab, window, context))
    }
}

export default class TimeCollector {
    context: CollectionContext

    constructor(context: CollectionContext) {
        this.context = context
    }

    collect() {
        this.context.init()
        if (this.context.timerContext.isPaused()) return
        doCollect(this.context)
    }
}