const { userAgent } = navigator
export const IS_FIREFOX: boolean = /Firefox[\/\s](\d+\.\d+)/.test(userAgent)

export const IS_CHROME: boolean = userAgent.indexOf('Chrome') > -1

export const IS_EDGE: boolean = userAgent.indexOf('Edge') > -1
