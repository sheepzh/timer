/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import HostAlert from "@app/components/common/host-alert"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"
import { labelOf } from "../../common"

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
            default: ({ row }: { row: timer.site.AliasIcon }) => row.merged
                ? h('a',
                    { class: 'el-link el-link--default is-underline' },
                    h('span', { class: 'el-link--inner' }, labelOf(row))
                )
                : h(HostAlert, {
                    host: labelOf(row),
                    iconUrl: row.iconUrl
                })
        })
    }
})

export default _default