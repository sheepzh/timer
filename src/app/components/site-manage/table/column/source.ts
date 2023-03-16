/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn, ElTag } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"

const SOURCE_DESC: { [source in timer.site.AliasSource]: string } = {
    USER: t(msg => msg.siteManage.source.user),
    DETECTED: t(msg => msg.siteManage.source.detected)
}

function renderSource(source: timer.site.AliasSource) {
    const type = source === 'USER' ? '' : 'info'
    return h(ElTag, { type, size: 'small' }, () => SOURCE_DESC[source])
}

const _default = defineComponent({
    name: "SourceColumn",
    setup() {
        return () => h(ElTableColumn, {
            prop: 'source',
            label: t(msg => msg.siteManage.column.source),
            minWidth: 70,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.site.SiteInfo }) => row.source ? renderSource(row.source) : ''
        })
    }
})

export default _default