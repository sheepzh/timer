/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { ElSwitch, ElTableColumn } from "element-plus"
import { defineComponent, toRaw } from "vue"
import { verifyCanModify } from "../../common"

const sortByEnabled: CompareFn<timer.limit.Item> = (a, b): number => (a.enabled ? 1 : 0) - (b.enabled ? 1 : 0)

const _default = defineComponent({
    emits: {
        rowChange: (_row: timer.limit.Item, _val: boolean) => true
    },
    setup(_, ctx) {
        const handleChange = async (row: timer.limit.Item, newVal: boolean) => {
            try {
                newVal && await verifyCanModify(row)
                row.enabled = newVal
                ctx.emit("rowChange", toRaw(row), newVal)
            } catch (e) {
                console.log(e)
            }
        }

        return () => (
            <ElTableColumn
                label={t(msg => msg.limit.item.enabled)}
                minWidth={100}
                align="center"
                fixed="right"
                sortable
                sortMethod={sortByEnabled}
            >
                {({ row }: ElTableRowScope<timer.limit.Item>) => <ElSwitch
                    modelValue={row.enabled}
                    onChange={(val: boolean) => handleChange(row, val)}
                />}
            </ElTableColumn>
        )
    }
})

export default _default