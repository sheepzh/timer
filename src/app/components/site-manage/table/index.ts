/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTable } from "element-plus"
import { defineComponent, h, PropType } from "vue"
import AliasColumn from "./column/alias"
import HostColumn from "./column/host"
import SourceColumn from "./column/source"
import OperationColumn from "./column/operation"

const _default = defineComponent({
    name: "SiteManageTable",
    props: {
        data: Array as PropType<timer.site.AliasIcon[]>
    },
    emits: {
        rowDelete: (_row: timer.site.AliasIcon) => true,
        rowModify: (_row: timer.site.AliasIcon) => true,
    },
    setup(props, ctx) {
        return () => h(ElTable, {
            data: props.data,
            border: true,
            size: 'small',
            style: { width: '100%' },
            highlightCurrentRow: true,
            fit: true,
        }, () => [
            h(HostColumn),
            h(AliasColumn),
            h(SourceColumn),
            h(OperationColumn, {
                onModify: (row: timer.site.AliasIcon) => ctx.emit("rowModify", row),
                onDelete: (row: timer.site.AliasIcon) => ctx.emit("rowDelete", row)
            })
        ])
    }
})

export default _default
