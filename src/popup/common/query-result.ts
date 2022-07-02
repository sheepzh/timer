/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */


export type PopupItem = timer.stat.Row & { isOther?: boolean }

type QueryResult = {
    type: timer.stat.Dimension
    mergeHost: boolean
    data: PopupItem[]
    // Filter items
    chartTitle: string
    date: Date | Date[]
}

export default QueryResult