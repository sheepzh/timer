/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import { t } from "@app/locale"
import { cvt2LocaleTime } from "@app/util/time"
import { ElTableRowScope } from "@src/element-ui/table"

const columnLabel = t(msg => msg.item.date)

const _default = defineComponent(() => {
    return () => (
        <ElTableColumn prop="date" label={columnLabel} minWidth={135} align="center" sortable="custom">
            {({ row }: ElTableRowScope<timer.stat.Row>) => <span>{cvt2LocaleTime(row.date)}</span>}
        </ElTableColumn>
    )
})

export default _default