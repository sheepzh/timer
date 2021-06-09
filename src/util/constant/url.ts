import { IS_FIREFOX, IS_CHROME, IS_EDGE } from "./environment"

/**
 * @param domain domain
 * @return Url of domain's favicon
 */
export function FAVICON(domain: string): string {
    return `https://favicon-1256916044.cos.ap-guangzhou.myqcloud.com/${domain}`
}

let homePage = undefined
if (IS_FIREFOX) {
    homePage = 'https://addons.mozilla.org/zh-CN/firefox/addon/web%E6%99%82%E9%96%93%E7%B5%B1%E8%A8%88/'
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

/**
 * Feedback powered by www.wjx.cn
 * 
 * @since 0.1.6
 */
export const ZH_FEEDBACK_PAGE = 'https://www.wjx.cn/vj/YFWwHUy.aspx'