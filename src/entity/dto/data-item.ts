/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

type DataDimension = timer.DataDimension

export const ALL_DATA_ITEMS: DataDimension[] = ['focus', 'total', 'time']

export type DataItemVal = { [item in DataDimension]: number }

/**
 * The unique key of data item
 */
export type DataItemUk = {
    host: string
    date?: string
}

export default class DataItem implements DataItemVal {
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
    mergedHosts: DataItem[]
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

    constructor(key: DataItemUk, item?: DataItemVal) {
        this.host = key.host
        this.date = key.date || ''

        this.total = item && item.total || 0
        this.focus = item && item.focus || 0
        this.time = item && item.time || 0
        this.mergedHosts = []
    }
}