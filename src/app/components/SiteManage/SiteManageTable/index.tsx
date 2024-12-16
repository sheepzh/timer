/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { PropType } from "vue"

import Flex from "@app/components/common/Flex"
import HostAlert from "@app/components/common/HostAlert"
import { t } from "@app/locale"
import siteService from "@service/site-service"
import { ElTableRowScope } from "@src/element-ui/table"
import { ElTable, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import Category from "./Category"
import AliasColumn from "./column/AliasColumn"
import OperationColumn from "./column/OperationColumn"
import TypeColumn from "./column/TypeColumn"

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
                minWidth={220}
                align="center"
                v-slots={({ row }: ElTableRowScope<timer.site.SiteInfo>) => (
                    <div style={{ margin: 'auto', width: 'fit-content' }}>
                        <HostAlert host={row.host} clickable={false} />
                    </div>
                )}
            />
            <TypeColumn />
            <ElTableColumn
                label={t(msg => msg.siteManage.column.icon)}
                minWidth={100}
                align="center"
                v-slots={({ row }: ElTableRowScope<timer.site.SiteInfo>) => {
                    const { iconUrl } = row || {}
                    if (!iconUrl) return ''
                    return (
                        <Flex align="center" justify="center">
                            <img width={12} height={12} src={iconUrl} onError={() => handleIconError(row)} />
                        </Flex>
                    )
                }}
            />
            <AliasColumn onRowAliasSaved={row => ctx.emit("rowModify", row)} />
            <ElTableColumn
                label={t(msg => msg.siteManage.column.cate)}
                minWidth={140}
                align="center"
                v-slots={({ row }: { row: timer.site.SiteInfo }) => <Category modelValue={row.cate} />}
            />
            <OperationColumn onDelete={row => ctx.emit("rowDelete", row)} />
        </ElTable>
    }
})

export default _default
