/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import initTypeSelect, { getSelectedType } from "./type-select"
import initMergeHost, { mergedHost } from "./merge-host"

// Links
import './all-function'
import './upgrade'
import './meat'

import './total-info'
import timerService, { FillFlagParam, SortDirect, TimerQueryParam } from "@service/timer-service"
import DataItem from "../../../entity/dto/data-item"
import { t } from "../../locale"
import { QueryResult } from "../../popup"
import { formatPeriodCommon } from "../../../util/time"
import { updateTotal } from "./total-info"
import optionService from "@service/option-service"

export function getQueryParam() {
    const param: TimerQueryParam = {
        date: new Date(),
        mergeHost: mergedHost(),
        sort: getSelectedType(),
        sortOrder: SortDirect.DESC
    }
    return param
}

let afterQuery: (result: QueryResult) => void

function _default(handleQuery: (result: QueryResult) => void) {
    afterQuery = handleQuery
}

/**
 * @param data result items
 * @param type type
 * @returns total alert text
 */
const getTotalInfo = (data: DataItem[], type: Timer.DataDimension) => {
    if (type === 'time') {
        const totalCount = data.map(d => d[type] || 0).reduce((a, b) => a + b, 0)
        return t(msg => msg.totalCount, { totalCount })
    } else {
        const totalTime = formatPeriodCommon(data.map(d => d[type]).reduce((a, b) => a + b, 0))
        return t(msg => msg.totalTime, { totalTime })
    }
}

const FILL_FLAG_PARAM: FillFlagParam = { iconUrl: true, alias: true }

async function query() {
    const itemCount = (await optionService.getAllOption()).popupMax
    const queryParam = getQueryParam()
    const rows = await timerService.select(queryParam, FILL_FLAG_PARAM)
    const result = []
    const other: DataItem = { host: t(msg => msg.otherLabel), focus: 0, total: 0, date: '0000-00-00', time: 0, mergedHosts: [] }
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (i < itemCount) {
            result.push(row)
        } else {
            other.focus += row.focus
            other.total += row.total
        }
    }
    result.push(other)
    const type = queryParam.sort as Timer.DataDimension
    const data = result.filter(item => item[type])

    const queryResult: QueryResult = {
        data,
        mergeHost: queryParam.mergeHost,
        type
    }
    updateTotal(getTotalInfo(data, type))
    afterQuery?.(queryResult)
}

query()

initTypeSelect(query)
initMergeHost(query)

export const queryInfo = query

export default _default