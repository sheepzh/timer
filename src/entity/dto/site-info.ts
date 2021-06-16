export declare type SiteItem = 'total' | 'focus' | 'time'

export const ALL_SITE_ITEMS: SiteItem[] = ['focus', 'total', 'time']

export default class SiteInfo {
    host: string
    date: string
    total: number
    focus: number
    time: number
    /**
     * The merged domains
     * 
     * Can't be empty if merged
     * 
     * @since 0.1.5
     */
    mergedHosts: SiteInfo[]
    /**
     * Icon url
     * 
     * Must be undefined if merged
     */
    iconUrl?: string

    constructor(host: string, date?: string, total?: number, focus?: number, time?: number) {
        this.host = host
        this.date = date || ''
        this.total = total || 0
        this.focus = focus || 0
        this.time = time || 0
        this.mergedHosts = []
    }
}