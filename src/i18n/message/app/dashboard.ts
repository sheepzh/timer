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
    },
    topK: {
        title: string
        filter: {
            chartType: {
                pie: string
                bar: string
                halfPie: string
            }
        }
    }
    indicator: {
        installedDays: string
        visitCount: string
        browsingTime: string
        mostUse: string
    }
    monthOnMonth: {
        title: string
    }
}

const _default: Messages<DashboardMessage> = resource

export default _default
