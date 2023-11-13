/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"
import { period2Str } from "@util/limit"

const label = t(msg => msg.limit.item.period)

const SPAN_STYLE: Partial<CSSStyleDeclaration> = {
    display: "block"
}

const _default = defineComponent({
    setup() {
        return () => h(ElTableColumn, {
            label,
            align: "center",
            minWidth: 100,
        }, {
            default: ({ row }: { row: timer.limit.Item }) => {
                const periods = row?.periods
                if (!periods?.length) return "-"
                const tags = periods.map(p => h("span", { style: SPAN_STYLE }, period2Str(p)))
                return h('div', {}, tags)
            }
        })
    }
})

export default _default