/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DataItem from "@entity/dto/data-item"

export type PopupItem = DataItem & { isOther?: boolean }

type QueryResult = {
    type: Timer.DataDimension
    mergeHost: boolean
    data: PopupItem[]
    // Filter items
    chartTitle: string
    date: Date | Date[]
}

export default QueryResult