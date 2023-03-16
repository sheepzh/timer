/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"
import HostAlert from "@app/components/common/host-alert"

const label = t(msg => msg.siteManage.column.host)

const _default = defineComponent({
    name: "AliasColumn",
    setup() {
        return () => h(ElTableColumn, {
            prop: 'host',
            label,
            minWidth: 120,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.site.SiteInfo }) => h(HostAlert, {
                host: row.host,
                clickable: false
            })
        })
    }
})

export default _default