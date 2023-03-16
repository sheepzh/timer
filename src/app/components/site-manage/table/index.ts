/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { PropType } from "vue"

import { ElTable } from "element-plus"
import { defineComponent, h } from "vue"
import AliasColumn from "./column/alias"
import HostColumn from "./column/host"
import IconColumn from "./column/icon"
import TypeColumn from "./column/type"
import SourceColumn from "./column/source"
import OperationColumn from "./column/operation"

const _default = defineComponent({
    name: "SiteManageTable",
    props: {
        data: Array as PropType<timer.site.SiteInfo[]>
    },
    emits: {
        rowDelete: (_row: timer.site.SiteInfo) => true,
        rowModify: (_row: timer.site.SiteInfo) => true,
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
            h(TypeColumn),
            h(IconColumn),
            h(AliasColumn),
            h(SourceColumn),
            h(OperationColumn, {
                onDelete: (row: timer.site.SiteInfo) => ctx.emit("rowDelete", row)
            })
        ])
    }
})

export default _default
