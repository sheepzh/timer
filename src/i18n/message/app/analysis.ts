/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './analysis-resource.json'

export type AnalysisMessage = {
    common: {
        focusTotal: string
        visitTotal: string
        ringGrowth: string
        merged: string
        virtual: string
        hostPlaceholder: string
        emptyDesc: string
    }
    summary: {
        title: string
        day: string
        firstDay: string
    }
    trend: {
        title: string
        startDate: string,
        endDate: string
        lastWeek: string
        last15Days: string
        last30Days: string
        last90Days: string
        activeDay: string
        totalDay: string
        maxFocus: string
        averageFocus: string
        maxVisit: string
        averageVisit: string
        focusTitle: string
        visitTitle: string
    }
}

const _default: Messages<AnalysisMessage> = resource

export default _default