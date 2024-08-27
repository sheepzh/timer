/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Effect, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import { t } from "@app/locale"
import HostAlert from "@app/components/common/HostAlert"
import { isRemainHost } from "@util/constant/remain-host"
import { ElTableRowScope } from "@src/element-ui/table"
import { useReportFilter } from "../../context"
import TooltipWrapper from "@app/components/common/TooltipWrapper"

const columnLabel = t(msg => msg.item.host)

const _default = defineComponent(() => {
    const filter = useReportFilter()
    return () => (
        <ElTableColumn prop="host" label={columnLabel} minWidth={210} sortable="custom" align="center">
            {({ row: { mergedHosts, host, iconUrl } }: ElTableRowScope<timer.stat.Row>) => (
                <TooltipWrapper
                    showPopover={filter.value?.mergeHost}
                    effect={Effect.LIGHT}
                    offset={10}
                    placement="left"
                    v-slots={{
                        content: () => mergedHosts?.map(({ host, iconUrl }) =>
                            <p>
                                <HostAlert host={host} iconUrl={iconUrl} clickable={!isRemainHost(host)} />
                            </p>
                        )
                    }}
                >
                    <div style={{ margin: 'auto', width: 'fit-content' }}>
                        <HostAlert
                            host={host}
                            iconUrl={iconUrl}
                            clickable={!isRemainHost(host)}
                        />
                    </div>
                </TooltipWrapper>
            )}
        </ElTableColumn>
    )
})

export default _default