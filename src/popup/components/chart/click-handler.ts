/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ReportQuery } from "@app/components/report"
import type QueryResult from "@popup/common/query-result"
import type { PopupItem } from "@popup/common/query-result"
import type { CallbackDataParams } from "echarts/types/dist/shared"

import { REPORT_ROUTE } from "@app/router/constants"
import { getAppPageUrl } from "@util/constant/url"

function generateUrl(data: PopupItem, queryResult: QueryResult): string {
    const { host, isOther } = data
    if (!isOther) {
        return host ? `http://${host}` : undefined
    }
    const query: ReportQuery = {}
    // Merge host
    queryResult.mergeHost && (query.mh = "1")
    // Date
    const date = queryResult.date
    if (Array.isArray(date)) {
        if (date.length === 1) {
            query.ds = query.de = date[0]?.getTime?.()?.toString?.()
        } else if (date.length === 2) {
            query.ds = date[0]?.getTime?.()?.toString?.()
            // End is now
            // Not the end of this week/month
            query.de = new Date().getTime().toString()
        }
    } else if (!!date) {
        query.ds = query.de = date.getTime?.()?.toString?.()
    }
    // Sorted column
    query.sc = queryResult.type
    return getAppPageUrl(false, REPORT_ROUTE, query)
}

function handleClick(params: CallbackDataParams, queryResult: QueryResult) {
    const data: PopupItem = params.data as PopupItem
    if (!data) {
        return
    }
    const componentType = params.componentType
    if (componentType === 'series') {
        const url = generateUrl(data, queryResult)
        url && chrome.tabs.create({ url })
    }
}

export default handleClick