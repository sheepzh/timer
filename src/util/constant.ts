export const HOST_END = 'hostEnd'

export const SAVE_FOCUS = 'saveFocus'

export const FOCUS = 'focus'

export const UNFOCUS = 'unfocus'

const { userAgent } = navigator
export const IS_FIREFOX: boolean = /Firefox[\/\s](\d+\.\d+)/.test(userAgent)

export const IS_CHROME: boolean = userAgent.indexOf('Chrome') > -1

export const IS_EDGE: boolean = userAgent.indexOf('Edge') > -1

/**
 * @param domain domain
 * @return Url of domain's favicon
 */
export function FAVICON(domain: string): string {
    return `https://favicon-1256916044.cos.ap-guangzhou.myqcloud.com/${domain}`
}

let homePage = undefined
if (IS_FIREFOX) {
    homePage = 'https://addons.mozilla.org/zh-CN/firefox/addon/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/'
} else if (IS_CHROME) {
    homePage = 'https://chrome.google.com/webstore/detail/%E7%BD%91%E8%B4%B9%E5%BE%88%E8%B4%B5-%E4%B8%8A%E7%BD%91%E6%97%B6%E9%97%B4%E7%BB%9F%E8%AE%A1/dkdhhcbjijekmneelocdllcldcpmekmm'
} else if (IS_EDGE) {
    homePage = 'https://microsoftedge.microsoft.com/addons/detail/timer-the-web-time-is-e/fepjgblalcnepokjblgbgmapmlkgfahc'
}

/**
 * @since 0.0.5
 */
export const HOME_PAGE = homePage

/**
 * @since 0.0.6
 */
export const GITHUB_ISSUE_ADD = 'https://github.com/sheepzh/timer/issues/new'