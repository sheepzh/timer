/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import axios, { AxiosResponse } from 'axios'
import { IS_CHROME, IS_EDGE, IS_FIREFOX } from '../util/constant/environment'

async function getFirefoxVersion(): Promise<string | null> {
    const response: AxiosResponse<any> = await axios.get('https://addons.mozilla.org/api/v3/addons/addon/2690100')
    if (response.status !== 200) {
        return Promise.resolve(null)
    } else {
        return Promise.resolve((response.data as FirefoxDetail).current_version.version)
    }
}

async function getEdgeVersion(): Promise<string | null> {
    const response: AxiosResponse<any> = await axios.get('https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/fepjgblalcnepokjblgbgmapmlkgfahc')
    if (response.status !== 200) {
        return Promise.resolve(null)
    } else {
        return Promise.resolve((response.data as EdgeDetail).version)
    }
}

async function getChromeVersion() {
    // Get info from shields.io
    const response: AxiosResponse<any> = await axios.get('https://img.shields.io/chrome-web-store/v/dkdhhcbjijekmneelocdllcldcpmekmm?label=Google%20Chrome')
    if (response.status !== 200) {
        return Promise.resolve(null)
    } else {
        const data = response.data
        const pattern = /:\sv(\d+\.\d+\.\d+)/
        const matchResult = pattern.exec(data)
        return Promise.resolve(matchResult.length === 2 ? matchResult[1] : null)
    }
}

export function getLatestVersion(): Promise<string | null> {
    if (IS_FIREFOX) {
        return getFirefoxVersion()
    } else if (IS_CHROME) {
        return getChromeVersion()
    } else if (IS_EDGE) {
        return getEdgeVersion()
    }
    return Promise.resolve(null)
}
