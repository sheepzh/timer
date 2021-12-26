/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElSwitch, ElTableColumn } from "element-plus"
import { h } from "vue"
import TimeLimitItem from "@entity/dto/time-limit-item"
import limitService from "@service/limit-service"
import { t } from "@app/locale"

const columnProps = {
    prop: 'enabled',
    label: t(msg => msg.limit.item.enabled),
    minWidth: 80,
    align: 'center',
}

const handleChange = (row: TimeLimitItem, val: boolean) => {
    row.enabled = val
    limitService.update(row)
}

const slots = {
    default: ({ row }: { row: TimeLimitItem }) => h(ElSwitch, {
        modelValue: row.enabled,
        onChange: (val: boolean) => handleChange(row, val)
    })
}

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default