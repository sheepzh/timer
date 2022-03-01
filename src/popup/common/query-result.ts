/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DataItem from "@entity/dto/data-item"

type QueryResult = {
    type: Timer.DataDimension
    mergeHost: boolean
    data: DataItem[]
    // Filter items
    chartTitle: string
    date: Date | Date[]
}

export default QueryResult