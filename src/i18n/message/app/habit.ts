/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './habit-resource.json'

export type HabitMessage = {
    sizes: {
        fifteen: string
        halfHour: string
        hour: string
        twoHour: string
    },
    average: {
        label: string
    },
    chart: {
        title: string
        saveAsImageTitle: string
        yAxisMin: string
        yAxisHour: string
    }
}

const _default: Messages<HabitMessage> = resource

export default _default