/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { h, defineComponent } from "vue"
import { t } from "@app/locale"
import HostAlert from "@app/components/common/host-alert"
import HostMergedAlert from './host-merged-alert'
import { isRemainHost } from "@util/constant/remain-host"

const columnLabel = t(msg => msg.item.host)

const _default = defineComponent({
    name: "HostColumn",
    props: {
        mergeHost: {
            type: Boolean,
            required: true
        }
    },
    setup(props) {
        return () => h(ElTableColumn, {
            prop: "host",
            label: columnLabel,
            minWidth: 210,
            sortable: "custom",
            align: "center"
        }, {
            default: ({ row }: { row: timer.stat.Row }) => props.mergeHost
                ? h(HostMergedAlert,
                    { mergedHost: row.host },
                    () => row.mergedHosts.map(origin =>
                        h('p', h(HostAlert, { host: origin.host, iconUrl: origin.iconUrl, clickable: !isRemainHost(origin.host) }))
                    )
                )
                : h(HostAlert, { host: row.host, iconUrl: row.iconUrl, clickable: !isRemainHost(row.host) })
        })
    }
})

export default _default