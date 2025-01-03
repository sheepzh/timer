/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './percentage-resource.json'

export type PercentageMessage = {
    title: { [key in timer.option.PopupDuration]: string }
    saveAsImageTitle: string
    averageTime: string
    averageCount: string
    otherLabel: string
}

const percentageMessages = resource as Messages<PercentageMessage>

export default percentageMessages