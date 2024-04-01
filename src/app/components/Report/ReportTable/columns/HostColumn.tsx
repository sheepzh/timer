/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Effect, ElTableColumn, ElTooltip } from "element-plus"
import { h, defineComponent } from "vue"
import { t } from "@app/locale"
import HostAlert from "@app/components/common/HostAlert"
import { isRemainHost } from "@util/constant/remain-host"
import { ElTableRowScope } from "@src/element-ui/table"
import { useReportFilter } from "../../context"

/**
 * Merged host column
 *
 * @since 0.7.0
 */
const HostMergedAlert = defineComponent({
    props: {
        mergedHost: {
            type: String,
            required: true
        }
    },
    setup(props, ctx) {
        return () => (
            <ElTooltip
                placement="left"
                effect={Effect.LIGHT}
                offset={10}
                v-slots={{ content: () => h(ctx.slots.default) }}
            >
                <a class="el-link el-link--default is-underline">
                    <span class="el-link--inner">{props.mergedHost}</span>
                </a>
            </ElTooltip>
        )
    }
})

const columnLabel = t(msg => msg.item.host)

const _default = defineComponent(() => {
    const filter = useReportFilter()
    return () => (
        <ElTableColumn prop="host" label={columnLabel} minWidth={210} sortable="custom" align="center">
            {
                ({ row }: ElTableRowScope<timer.stat.Row>) => filter.value?.mergeHost
                    ? <HostMergedAlert mergedHost={row.host}>
                        {() => row.mergedHosts.map(origin =>
                            <p>
                                <HostAlert {...origin} clickable={!isRemainHost(origin.host)} />
                            </p>
                        )}
                    </HostMergedAlert>
                    : <HostAlert {...row} clickable={!isRemainHost(row.host)} />
            }
        </ElTableColumn>
    )
})

export default _default