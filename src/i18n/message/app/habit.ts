/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './habit-resource.json'

export type HabitMessage = {
    common: {
        focusAverage: string
    }
    period: {
        title: string
        busiest: string
        idle: string
        yAxisMin: string
        yAxisHour: string
        averageLabel: string
        sizes: {
            fifteen: string
            halfHour: string
            hour: string
            twoHour: string
        }
    }
    site: {
        title: string
        focusPieTitle: string
        visitPieTitle: string
        otherLabel: string
        histogramTitle: string
        exclusiveToday: string
        countTotal: string
        siteAverage: string
    }
}

const _default: Messages<HabitMessage> = resource

export default _default