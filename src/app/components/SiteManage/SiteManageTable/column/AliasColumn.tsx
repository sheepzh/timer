/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import { t } from "@app/locale"
import Editable from "@app/components/common/Editable"
import siteService from "@service/site-service"
import ColumnHeader from "@app/components/common/ColumnHeader"

const _default = defineComponent({
    emits: {
        rowAliasSaved: (_row: timer.site.SiteInfo, _newAlias: string) => true,
    },
    setup: (_, ctx) => {
        const handleChange = async (newAlias: string, row: timer.site.SiteInfo) => {
            newAlias = newAlias?.trim?.()
            row.alias = newAlias
            if (newAlias) {
                await siteService.saveAlias(row, newAlias, "USER")
            } else {
                await siteService.removeAlias(row)
            }
            ctx.emit("rowAliasSaved", row, newAlias)
        }

        return () => (
            <ElTableColumn
                minWidth={100}
                align="center"
                v-slots={{
                    header: () => <ColumnHeader
                        label={t(msg => msg.siteManage.column.alias)}
                        tooltipContent={t(msg => msg.siteManage.column.aliasInfo)}
                    />,
                    default: ({ row }: { row: timer.site.SiteInfo }) => <Editable
                        modelValue={row.alias}
                        onChange={val => handleChange(val, row)}
                    />,
                }}
            />
        )
    }
})

export default _default