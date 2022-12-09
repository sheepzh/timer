/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import packageInfo from "@src/package"
import { t } from "@popup/locale"
import { formatPeriodCommon } from "@util/time"
import { sum } from "@util/array"

/**
 * @param data result items
 * @param type type
 * @returns total alert text
 */
function getTotalInfo(data: timer.stat.Row[], type: timer.stat.Dimension): string {
    if (type === 'time') {
        const totalCount = sum(data.map(d => d.time || 0))
        return t(msg => msg.chart.totalCount, { totalCount })
    } else if (type === 'focus') {
        const totalTime = formatPeriodCommon(sum(data.map(d => d.focus || 0)))
        return t(msg => msg.chart.totalTime, { totalTime })
    } else {
        return ''
    }
}

class TotalInfoWrapper {
    totalInfoSpan: HTMLElement

    constructor() {
        this.totalInfoSpan = document.getElementById('total-info') as HTMLSpanElement
    }

    updateTotal(data: timer.stat.Row[], type: timer.stat.Dimension): void {
        this.totalInfoSpan.innerText = `v${packageInfo.version} ${getTotalInfo(data, type)}`
    }
}

export default TotalInfoWrapper
