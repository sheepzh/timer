/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { PropType } from "vue"

import Flex from "@src/pages/components/Flex"
import HostAlert from "@app/components/common/HostAlert"
import { t } from "@app/locale"
import siteService from "@service/site-service"
import { ElTableRowScope } from "@pages/element-ui/table"
import { supportCategory } from "@util/site"
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
        selectionChange: (_rows: timer.site.SiteInfo[]) => true,
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
            onSelection-change={rows => ctx.emit('selectionChange', rows)}
        >
            <ElTableColumn type="selection" align="center" />
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
                v-slots={({ row }: ElTableRowScope<timer.site.SiteInfo>) => supportCategory(row) && (
                    <Category
                        modelValue={row}
                        onChange={cateId => row.cate = cateId}
                    />
                )}
            />
            <OperationColumn onDelete={row => ctx.emit("rowDelete", row)} />
        </ElTable>
    }
})

export default _default
