/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTable } from "element-plus"
import { defineComponent, h, PropType } from "vue"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import AliasColumn from "./column/alias"
import HostColumn from "./column/host"
import SourceColumn from "./column/source"
import OperationColumn from "./column/operation"

const _default = defineComponent({
    name: "SiteManageTable",
    props: {
        data: Array as PropType<HostAliasInfo[]>
    },
    emits: ["rowDelete", "rowModify"],
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
                onModify: (row: HostAliasInfo) => ctx.emit("rowModify", row),
                onDelete: (row: HostAliasInfo) => ctx.emit("rowDelete", row)
            })
        ])
    }
})

export default _default
