/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import ColumnHeader from "@app/components/common/ColumnHeader"
import { t } from "@app/locale"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { ElSwitch, ElTableColumn } from "element-plus"
import { defineComponent, toRaw } from "vue"
import { verifyCanModify } from "../../common"

const _default = defineComponent({
    emits: {
        rowChange: (_row: timer.limit.Item, _val: boolean) => true,
    },
    setup(_, ctx) {
        const handleChange = async (row: timer.limit.Item, newVal: boolean) => {
            try {
                newVal && await verifyCanModify(row)
                row.allowDelay = newVal
                ctx.emit("rowChange", toRaw(row), newVal)
            } catch (e) {
                console.log(e)
            }
        }

        return () => (
            <ElTableColumn
                minWidth={100}
                align="center"
                v-slots={{
                    header: () => <ColumnHeader
                        label={t(msg => msg.limit.item.delayAllowed)}
                        tooltipContent={t(msg => msg.limit.item.delayAllowedInfo)}
                    />,
                    default: ({ row }: ElTableRowScope<timer.limit.Item>) => <ElSwitch
                        modelValue={row.allowDelay}
                        onChange={(val: boolean) => handleChange(row, val)}
                    />,
                }}
            />
        )
    }
})

export default _default
