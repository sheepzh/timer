/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { PropType } from "vue"

import { ElTable, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import AliasColumn from "./column/AliasColumn"
import TypeColumn from "./column/TypeColumn"
import SourceColumn from "./column/SourceColumn"
import OperationColumn from "./column/OperationColumn"
import { t } from "@app/locale"
import HostAlert from "@app/components/common/HostAlert"
import { ElTableRowScope } from "@src/element-ui/table"
import siteService from "@service/site-service"

const _default = defineComponent({
    props: {
        data: Array as PropType<timer.site.SiteInfo[]>
    },
    emits: {
        rowDelete: (_row: timer.site.SiteInfo) => true,
        rowModify: (_row: timer.site.SiteInfo) => true,
    },
    setup(props, ctx) {
        const handleIconError = async (row: timer.site.SiteInfo) => {
            await siteService.removeIconUrl(row)
            row.iconUrl = null
        }
        return () => <ElTable
            data={props.data}
            size="small"
            style={{ width: "100%" }}
            highlightCurrentRow
            border
            fit
        >
            <ElTableColumn
                label={t(msg => msg.item.host)}
                minWidth={120}
                align="center"
                v-slots={({ row }: ElTableRowScope<timer.site.SiteInfo>) => <HostAlert host={row.host} clickable={false} />}
            />
            <TypeColumn />
            <ElTableColumn
                label={t(msg => msg.siteManage.column.icon)}
                minWidth={40}
                align="center"
                v-slots={({ row }: ElTableRowScope<timer.site.SiteInfo>) => {
                    const { iconUrl } = row || {}
                    if (!iconUrl) return ''
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img width={12} height={12} src={iconUrl} onError={() => handleIconError(row)} />
                        </div>
                    )
                }}
            />
            <AliasColumn onRowAliasSaved={row => ctx.emit("rowModify", row)} />
            <SourceColumn />
            <OperationColumn onDelete={row => ctx.emit("rowDelete", row)} />
        </ElTable>
    }
})

export default _default
