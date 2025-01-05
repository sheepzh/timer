/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import HostAlert from "@app/components/common/HostAlert"
import TooltipWrapper from "@app/components/common/TooltipWrapper"
import { t } from "@app/locale"
import Flex from "@pages/components/Flex"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { identifySiteKey } from "@util/site"
import { Effect, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import { useReportFilter } from "../../context"
import TooltipSiteList from "./TooltipSiteList"

const _default = defineComponent(() => {
    const filter = useReportFilter()
    return () => (
        <ElTableColumn
            prop="host"
            label={t(msg => msg.item.host)}
            minWidth={210}
            sortable="custom"
            align="center"
        >
            {({ row: { mergedRows, siteKey, iconUrl } }: ElTableRowScope<timer.stat.Row>) => (
                <Flex key={identifySiteKey(siteKey)} justify="center">
                    <TooltipWrapper
                        showPopover={filter.value?.siteMerge === 'domain'}
                        effect={Effect.LIGHT}
                        offset={10}
                        placement="left"
                        v-slots={{
                            content: () => <TooltipSiteList modelValue={mergedRows} />,
                            default: () => siteKey?.host ? <HostAlert value={siteKey} iconUrl={iconUrl} /> : '',
                        }}
                    />
                </Flex>
            )
            }
        </ElTableColumn >
    )
})

export default _default