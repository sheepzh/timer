import { createTab } from "@api/chrome/tab"
import { REPORT_ROUTE } from "@app/router/constants"
import { type PopupResult, type PopupRow } from "@popup/common"
import { getAppPageUrl } from "@util/constant/url"
import { type CallbackDataParams } from "echarts/types/dist/shared"

function generateUrl(data: PopupRow, queryResult: PopupResult): string {
    const { host, isOther } = data
    if (!isOther) {
        return host ? `http://${host}` : undefined
    }
    const query: ReportQueryParam = {}
    // Merge host
    queryResult?.query?.mergeHost && (query.mh = "1")
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
    query.sc = queryResult?.query?.type
    return getAppPageUrl(false, REPORT_ROUTE, query)
}

export function handleClick(params: CallbackDataParams, queryResult: PopupResult) {
    const data: PopupRow = params.data as PopupRow
    if (!data) {
        return
    }
    const componentType = params.componentType
    if (componentType === 'series') {
        const url = generateUrl(data, queryResult)
        url && createTab(url)
    }
}