export const HOST_START = 'hostStart'

export const HOST_END = 'hostEnd'

export const SAVE_FOCUS = 'saveFocus'

export const FOCUS = 'focus'

export const UNFOCUS = 'unfocus'

export const IS_FIREFOX: boolean = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)

/**
 * @param domain domain
 * @return Url of domain's favicon
 */
export function FAVICON(domain: string): string {
    return `https://favicon-1256916044.cos.ap-guangzhou.myqcloud.com/${domain}`
}