/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import resource from './calendar-resource.json'

export type CalendarMessage = {
    weekDays: string
    months: string
    dateFormat: string
    timeFormat: string
    simpleTimeFormat: string
    label: {
        startDate: string
        endDate: string
    }
    range: {
        today: string
        yesterday: string
        everyday: string
        last24Hours: string
        last3Days: string
        last7Days: string
        last15Days: string
        last30Days: string
        last60Days: string
        last90Days: string
    }
}

const _default: Messages<CalendarMessage> = resource

export default _default