/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { InfoFilled } from "@element-plus/icons"
import { ElIcon, ElSwitch, ElTableColumn, ElTooltip } from "element-plus"
import { h } from "vue"
import TimeLimitItem from "@entity/dto/time-limit-item"
import limitService from "@service/limit-service"
import { t } from "@app/locale"

const columnProps = {
    prop: 'delayClosed',
    label: t(msg => msg.limit.item.delayAllowed),
    minWidth: 80,
    align: 'center',
}

const handleChange = (row: TimeLimitItem, val: boolean) => {
    row.allowDelay = val
    limitService.updateDelay(row)
}

const headerAlert = () => h(ElTooltip, {
    content: t(msg => msg.limit.item.delayAllowedInfo),
    placement: 'top'
}, {
    default: () => h(ElIcon, { size: 14, style: { paddingLeft: '4px' } }, () => h(InfoFilled))
})

const slots = {
    default: ({ row }: { row: TimeLimitItem }) => h(ElSwitch, {
        modelValue: row.allowDelay,
        onChange: (val: boolean) => handleChange(row, val)
    }),
    header: () => h('div', [t(msg => msg.limit.item.delayAllowed), headerAlert()])
}

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default