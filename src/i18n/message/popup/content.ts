/**
 * Copyright (c) 2025-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './content-resource.json'

export type ContentMessage = {
    percentage: {
        title: { [key in timer.option.PopupDuration]: string }
        saveAsImageTitle: string
        averageTime: string
        averageCount: string
        totalTime: string
        totalCount: string
        otherLabel: string
    }
    ranking: {
        cateSiteCount: string
    }
}

const contentMessages = resource as Messages<ContentMessage>

export default contentMessages