/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

type SiteItem = Timer.SiteItem

export const ALL_SITE_ITEMS: SiteItem[] = ['focus', 'total', 'time']

export type SiteItemVal = { [item in SiteItem]: number }

export type SiteKeyVal = {
    host: string
    date?: string
}

export default class SiteInfo implements SiteItemVal {
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
    /**
     * The alias name of this Site, always is the title of its homepage by detected
     */
    alias?: string

    constructor(key: SiteKeyVal, item?: SiteItemVal) {
        this.host = key.host
        this.date = key.date || ''

        this.total = item && item.total || 0
        this.focus = item && item.focus || 0
        this.time = item && item.time || 0
        this.mergedHosts = []
    }
}