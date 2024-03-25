/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './chart-resource.json'

export type ChartMessage = {
    title: { [key in PopupDuration]: string }
    mergeHostLabel: string
    fileName: string
    saveAsImageTitle: string
    restoreTitle: string
    options: string
    totalTime: string
    totalCount: string
    averageTime: string
    averageCount: string
    otherLabel: string
}

export default resource satisfies Messages<ChartMessage>