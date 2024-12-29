/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import Flex from "@src/pages/components/Flex"
import HostAlert from "@src/pages/app/components/common/HostAlert"
import TooltipWrapper from "@src/pages/app/components/common/TooltipWrapper"
import { t } from "@src/pages/app/locale"
import { ElTableRowScope } from "@pages/element-ui/table"
import { Effect, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import { useReportFilter } from "../../context"
import TooltipSiteList from "./TooltipSiteList"

const columnLabel = t(msg => msg.item.host)

const _default = defineComponent(() => {
    const filter = useReportFilter()
    return () => (
        <ElTableColumn prop="host" label={columnLabel} minWidth={210} sortable="custom" align="center">
            {({ row: { mergedRows, siteKey, iconUrl } }: ElTableRowScope<timer.stat.Row>) => (
                <Flex justify="center">
                    <TooltipWrapper
                        showPopover={filter.value?.siteMerge === 'domain'}
                        effect={Effect.LIGHT}
                        offset={10}
                        placement="left"
                        v-slots={{
                            content: () => <TooltipSiteList modelValue={mergedRows} />,
                            default: () => siteKey?.host ? <HostAlert host={siteKey?.host} iconUrl={iconUrl} /> : '',
                        }}
                    />
                </Flex>
            )
            }
        </ElTableColumn >
    )
})

export default _default