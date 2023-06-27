/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './dashboard-resource.json'

export type DashboardMessage = {
    heatMap: {
        title0: string
        title1: string
        tooltip0: string
        tooltip1: string
    },
    topK: {
        title: string
        tooltip: string
    }
    indicator: {
        installedDays: string
        visitCount: string
        browsingTime: string
        mostUse: string
    }
    weekOnWeek: {
        title: string
        lastBrowse: string
        thisBrowse: string
        wow: string
        increase: string
        decline: string
    }
}

const _default: Messages<DashboardMessage> = resource

export default _default
