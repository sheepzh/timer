/**
 * Copyright (c) 2021-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getRuntimeId } from "@api/chrome/runtime"
import { IS_FIREFOX, IS_CHROME, IS_EDGE } from "./environment"

export const FIREFOX_HOMEPAGE = 'https://addons.mozilla.org/firefox/addon/besttimetracker'
export const CHROME_HOMEPAGE = 'https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm'
export const EDGE_HOMEPAGE = 'https://microsoftedge.microsoft.com/addons/detail/timer-the-web-time-is-e/fepjgblalcnepokjblgbgmapmlkgfahc'

let homePage = undefined
if (IS_FIREFOX) {
    homePage = FIREFOX_HOMEPAGE
} else if (IS_CHROME) {
    homePage = CHROME_HOMEPAGE
} else if (IS_EDGE) {
    homePage = EDGE_HOMEPAGE
}

/**
 * @since 0.0.5
 */
export const HOME_PAGE = homePage

/**
 * @since 0.4.0
 */
export const SOURCE_CODE_PAGE = 'https://github.com/sheepzh/timer'

/**
 * @since 1.9.4
 */
export const CHANGE_LOG_PAGE = 'https://github.com/sheepzh/timer/blob/main/CHANGELOG.md'

/**
 * @since 0.0.6
 */
export const GITHUB_ISSUE_ADD = 'https://github.com/sheepzh/timer/issues/new/choose'

/**
 * Feedback powered by www.wjx.cn
 * 
 * @since 0.1.6
 */
export const ZH_FEEDBACK_PAGE = 'https://www.wjx.cn/vj/YFWwHUy.aspx'

/**
 * Feedback powered by support.qq.com
 * 
 * @since 0.8.5
 */
export const TU_CAO_PAGE = 'https://support.qq.com/products/402895'

/**
 * @since 0.9.6
 */
export const FEEDBACK_QUESTIONNAIRE: Partial<{ [locale in timer.Locale]: string }> = {
    zh_CN: TU_CAO_PAGE,
    zh_TW: 'https://docs.google.com/forms/d/e/1FAIpQLSdfvG6ExLj331YOLZIKO3x98k3kMxpkkLW1RgFuRGmUnZCGRQ/viewform?usp=sf_link',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLSdNq4gnSY7uxYkyqOPqyYF3Bqlc3ZnWCLDi5DI5xGjPeVCNiw/viewform?usp=sf_link',
}

/**
 * @since 0.9.6
 */
export const UNINSTALL_QUESTIONNAIRE: { [locale in timer.Locale]: string } = {
    zh_CN: 'https://www.wjx.cn/vj/YDgY9Yz.aspx',
    zh_TW: 'https://docs.google.com/forms/d/e/1FAIpQLSdK93q-548dK-2naoS3DaArdc7tEGoUY9JQvaXP5Kpov8h6-A/viewform?usp=sf_link',
    ja: 'https://docs.google.com/forms/d/e/1FAIpQLSdsB3onZuleNf6j7KJJLbcote647WV6yeUr-9m7Db5QXakfpg/viewform?usp=sf_link',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLSflhZAFTw1rTUjAEwgxqCaBuhLBBthwEK9fIjvmwWfITLSK9A/viewform?usp=sf_link',
    pt_PT: 'https://docs.google.com/forms/d/e/1FAIpQLSflhZAFTw1rTUjAEwgxqCaBuhLBBthwEK9fIjvmwWfITLSK9A/viewform?usp=sf_link',
}

/**
 * The page of extension detail
 * @since 0.1.8
 */
let updatePage = SOURCE_CODE_PAGE

if (IS_CHROME) {
    updatePage = `chrome://extensions/?id=${getRuntimeId()}`
} else if (IS_EDGE) {
    // In the management page with developing-mode open
    updatePage = 'edge://extensions'
}

export const UPDATE_PAGE = updatePage

/**
 * @param isInBackground invoke in background environment
 * @since 0.2.2
 */
export function getAppPageUrl(isInBackground: boolean, route?: string, query?: any): string {
    let url = IS_FIREFOX && !isInBackground ? 'app.html' : 'static/app.html'
    route && (url += '#' + route)
    const queries = query ? Object.entries(query).map(([k, v]) => `${k}=${v}`).join('&') : ''
    queries && (url += '?' + queries)
    return url
}

/**
 * 
 * @param isInBackground invoke in background environment
 * @since 1.3.2
 */
export function getGuidePageUrl(isInBackground: boolean, route?: string): string {
    let url = IS_FIREFOX && !isInBackground ? 'guide.html' : 'static/guide.html'
    route && (url += '#' + route)
    return url
}

/**
 * @since 0.2.2
 * @deprecated mv3
 * @returns icon url in the browser
 */
export function iconUrlOfBrowser(protocol: string, host: string): string {
    if (IS_CHROME || IS_EDGE) {
        return `${IS_CHROME ? 'chrome' : 'edge'}://favicon/${protocol ? protocol + '://' : ''}${host}`
    }
    return undefined
}

/**
 * @since 0.9.3
 */
export const PSL_HOMEPAGE = 'https://publicsuffix.org/'

/**
 * The id of project on crowdin.com
 * 
 * @since 1.4.0
 */
export const CROWDIN_PROJECT_ID = 516822

/**
 * The url of project on crowdin.com
 * 
 * @since 1.4.0
 */
export const CROWDIN_HOMEPAGE = 'https://crowdin.com/project/timer-chrome-edge-firefox'
