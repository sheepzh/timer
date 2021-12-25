/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DataItem from "@entity/dto/data-item"

declare type QueryResult = {
    type: Timer.DataDimension
    mergeHost: boolean
    data: DataItem[]
}