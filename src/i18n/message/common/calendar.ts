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
}

const _default: Messages<CalendarMessage> = resource

export default _default