import initTypeSelect, { getSelectedType } from './type-select'
import initMergeDomain, { mergedDomain } from './merge-domain'

// Links
import './feedback'
import './all-function'
import './upgrade'
import './meat'

import './total-info'
import timerService, { SortDirect, TimerQueryParam } from '../../../service/timer-service'
import SiteInfo from '../../../entity/dto/site-info'
import { t } from '../../locale'
import { QueryResult } from '../../popup'
import { formatPeriodCommon } from '../../../util/time'
import { updateTotal } from './total-info'
import optionService from '../../../service/option-service'

export function getQueryParam() {
    const param: TimerQueryParam = {
        date: new Date(),
        mergeDomain: mergedDomain(),
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
const getTotalInfo = (data: SiteInfo[], type: Timer.SiteItem) => {
    if (type === 'time') {
        const totalCount = data.map(d => d[type] || 0).reduce((a, b) => a + b, 0)
        return t(msg => msg.totalCount, { totalCount })
    } else {
        const totalTime = formatPeriodCommon(data.map(d => d[type]).reduce((a, b) => a + b, 0))
        return t(msg => msg.totalTime, { totalTime })
    }
}

async function query() {
    const itemCount = (await optionService.getPopupOption()).popupMax
    const queryParam = getQueryParam()
    const rows = await timerService.select(queryParam, true)
    const result = []
    const other: SiteInfo = { host: t(msg => msg.otherLabel), focus: 0, total: 0, date: '0000-00-00', time: 0, mergedHosts: [] }
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
    const type = queryParam.sort as Timer.SiteItem
    const data = result.filter(item => item[type])

    const queryResult: QueryResult = {
        data,
        mergeDomain: queryParam.mergeDomain,
        type
    }
    updateTotal(getTotalInfo(data, type))
    afterQuery && afterQuery(queryResult)
}

query()

initTypeSelect(query)
initMergeDomain(query)

export const queryInfo = query

export default _default