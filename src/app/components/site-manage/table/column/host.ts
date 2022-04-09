/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import HostAlert from "@app/components/common/host-alert"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"

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
            default: ({ row }: { row: HostAliasInfo }) => h(HostAlert, { host: row.host, iconUrl: row.iconUrl })
        })
    }
})

export default _default