/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElIcon, ElTableColumn, ElTooltip } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"
import { InfoFilled } from "@element-plus/icons-vue"
import Editable from "@app/components/common/editable"
import siteService from "@service/site-service"

const label = t(msg => msg.siteManage.column.alias)
const tooltip = t(msg => msg.siteManage.column.aliasInfo)

function handleChange(newAlias: string, row: timer.site.SiteInfo) {
    newAlias = newAlias?.trim?.()
    row.alias = newAlias
    if (!newAlias) {
        siteService.removeAlias(row)
    } else {
        siteService.saveAlias(row, newAlias, 'USER')
    }
}

const renderTooltip = () => h(ElTooltip,
    { content: tooltip, placement: 'top' },
    () => h(ElIcon, { size: 11 }, () => h(InfoFilled))
)

const render = () => h(ElTableColumn, {
    prop: 'host',
    minWidth: 100,
    align: 'center',
}, {
    default: ({ row }: { row: timer.site.SiteInfo }) => h(Editable, {
        modelValue: row.alias,
        onChange: (newAlias: string) => handleChange(newAlias, row)
    }),
    header: () => [label, ' ', renderTooltip()]
})

const _default = defineComponent({ render })

export default _default