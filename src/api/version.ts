/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { BROWSER_NAME } from "@util/constant/environment"
import { fetchGet } from "./http"

/**
 * @since 0.1.8
 */
type FirefoxDetail = {
    current_version: {
        // Like 0.1.5
        version: string
    }
    // Like '2021-06-11T08:45:32Z'
    last_updated: string
}

/**
 * @since 0.1.8
 */
type EdgeDetail = {
    // Version like 0.1.5, without 'v' prefix
    version: string
    // Like '1619432502.5944779'
    lastUpdateDate: string
}

async function getFirefoxVersion(): Promise<string | undefined> {
    const response = await fetchGet('https://addons.mozilla.org/api/v3/addons/addon/2690100')
    const detail: FirefoxDetail = await response.json()
    return detail?.current_version?.version
}

async function getEdgeVersion(): Promise<string | undefined> {
    const response = await fetchGet('https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/fepjgblalcnepokjblgbgmapmlkgfahc')
    const detail: EdgeDetail = await response.json()
    return detail?.version
}

async function getChromeVersion(): Promise<string | undefined> {
    // Get info from shields.io
    const response = await fetchGet('https://img.shields.io/chrome-web-store/v/dkdhhcbjijekmneelocdllcldcpmekmm?label=Google%20Chrome')
    const data = await response.text()
    const pattern = /:\sv(\d+\.\d+\.\d+)/
    const matchResult = pattern.exec(data)
    return matchResult?.length === 2 ? matchResult?.[1] : undefined
}

export function getLatestVersion(): Promise<string | undefined> {
    if (BROWSER_NAME === 'firefox') {
        return getFirefoxVersion()
    } else if (BROWSER_NAME === 'chrome') {
        return getChromeVersion()
    } else if (BROWSER_NAME === 'edge') {
        return getEdgeVersion()
    }
    return Promise.resolve(undefined)
}
