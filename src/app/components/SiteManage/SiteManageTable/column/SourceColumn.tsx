/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { type ElTableRowScope } from "@src/element-ui/table"
import { ElTableColumn, ElTag } from "element-plus"
import { defineComponent } from "vue"

const SOURCE_DESC: { [source in timer.site.AliasSource]: string } = {
    USER: t(msg => msg.siteManage.source.user),
    DETECTED: t(msg => msg.siteManage.source.detected)
}

const _default = defineComponent({
    render: () => <ElTableColumn
        label={t(msg => msg.siteManage.column.source)}
        minWidth={70}
        align="center"
        v-slots={({ row: { source } }: ElTableRowScope<timer.site.SiteInfo>) => {
            if (!source) return ''
            return <ElTag
                type={source === "USER" ? null : "info"}
                size="small"
            >
                {SOURCE_DESC[source]}
            </ElTag>
        }}
    />
})

export default _default