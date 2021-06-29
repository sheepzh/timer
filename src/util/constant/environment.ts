const { userAgent } = navigator
export const IS_FIREFOX: boolean = /Firefox[\/\s](\d+\.\d+)/.test(userAgent)

export const IS_EDGE: boolean = userAgent.includes('Edg')

export const IS_CHROME: boolean = userAgent.includes('Chrome') && !userAgent.includes('Edg')
