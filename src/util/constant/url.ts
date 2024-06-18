/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getRuntimeId } from "@api/chrome/runtime"
import { IS_FIREFOX, IS_CHROME, IS_EDGE } from "./environment"
import { locale } from "@i18n"

export const FIREFOX_HOMEPAGE = 'https://addons.mozilla.org/firefox/addon/besttimetracker'
export const CHROME_HOMEPAGE = 'https://chromewebstore.google.com/detail/time-tracker/dkdhhcbjijekmneelocdllcldcpmekmm'
export const EDGE_HOMEPAGE = 'https://microsoftedge.microsoft.com/addons/detail/timer-the-web-time-is-e/fepjgblalcnepokjblgbgmapmlkgfahc'

let webstorePage = undefined
let reviewPage = undefined
if (IS_FIREFOX) {
    webstorePage = FIREFOX_HOMEPAGE
    reviewPage = FIREFOX_HOMEPAGE + "/reviews"
} else if (IS_CHROME) {
    webstorePage = CHROME_HOMEPAGE
    reviewPage = CHROME_HOMEPAGE + "/reviews"
} else if (IS_EDGE) {
    webstorePage = reviewPage = EDGE_HOMEPAGE
}

/**
 * @since 0.0.5
 */
export const WEBSTORE_PAGE = webstorePage

/**
 * @since 2.2.4
 */
export const REVIEW_PAGE = reviewPage

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

export const PRIVACY_PAGE = 'https://www.wfhg.cc/en/privacy.html'

export const LICENSE_PAGE = 'https://github.com/sheepzh/timer/blob/main/LICENSE'

/**
 * @since 0.9.6
 */
export const FEEDBACK_QUESTIONNAIRE: Partial<{ [locale in timer.Locale]: string }> = {
    zh_CN: TU_CAO_PAGE,
    zh_TW: 'https://docs.google.com/forms/d/e/1FAIpQLSdfvG6ExLj331YOLZIKO3x98k3kMxpkkLW1RgFuRGmUnZCGRQ/viewform?usp=sf_link',
    en: 'https://docs.google.com/forms/d/e/1FAIpQLSdNq4gnSY7uxYkyqOPqyYF3Bqlc3ZnWCLDi5DI5xGjPeVCNiw/viewform?usp=sf_link',
}

const UNINSTALL_QUESTIONNAIRE_EN = 'https://docs.google.com/forms/d/e/1FAIpQLSflhZAFTw1rTUjAEwgxqCaBuhLBBthwEK9fIjvmwWfITLSK9A/viewform?usp=sf_link'
/**
 * @since 0.9.6
 */
export const UNINSTALL_QUESTIONNAIRE: { [locale in timer.Locale]: string } = {
    zh_CN: 'https://www.wjx.cn/vj/YDgY9Yz.aspx',
    zh_TW: 'https://docs.google.com/forms/d/e/1FAIpQLSdK93q-548dK-2naoS3DaArdc7tEGoUY9JQvaXP5Kpov8h6-A/viewform?usp=sf_link',
    ja: 'https://docs.google.com/forms/d/e/1FAIpQLSdsB3onZuleNf6j7KJJLbcote647WV6yeUr-9m7Db5QXakfpg/viewform?usp=sf_link',
    en: UNINSTALL_QUESTIONNAIRE_EN,
    pt_PT: UNINSTALL_QUESTIONNAIRE_EN,
    uk: UNINSTALL_QUESTIONNAIRE_EN,
    es: UNINSTALL_QUESTIONNAIRE_EN,
    de: UNINSTALL_QUESTIONNAIRE_EN,
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

export const HOMEPAGE = "https://www.wfhg.cc"
const HOMEPAGE_LOCALES: timer.Locale[] = ["zh_CN", "zh_TW", "en"]

export function getHomepageWithLocale(): string {
    const homepageLocale: timer.Locale = HOMEPAGE_LOCALES.includes(locale) ? locale : "en"
    return `${HOMEPAGE}/${homepageLocale}/`
}

/**
 * @since 1.3.2
 */
export function getGuidePageUrl(): string {
    return getHomepageWithLocale() + 'guide/start'
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
