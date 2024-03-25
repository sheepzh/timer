/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { UnwrapRef } from "vue"

import { ElSwitch } from "element-plus"
import optionService from "@service/option-service"
import { defaultStatistics } from "@util/constant/option"
import { defineComponent, reactive, unref, watch } from "vue"
import { t } from "@app/locale"
import { OptionItem, OptionTag, OptionTooltip } from "../common"

function copy(target: timer.option.StatisticsOption, source: timer.option.StatisticsOption) {
    target.collectSiteName = source.collectSiteName
    target.countLocalFiles = source.countLocalFiles
}

const _default = defineComponent({
    setup(_props, ctx) {
        const option: UnwrapRef<timer.option.StatisticsOption> = reactive(defaultStatistics())
        optionService.getAllOption().then(currentVal => {
            copy(option, currentVal)
            watch(option, () => optionService.setStatisticsOption(unref(option)))
        })
        ctx.expose({
            reset: () => copy(option, defaultStatistics())
        })
        return () => <>
            <OptionItem
                label={msg => msg.option.statistics.countLocalFiles}
                defaultValue={t(msg => msg.option.yes)}
                hideDivider
                v-slots={{
                    info: () => <OptionTooltip>{t(msg => msg.option.statistics.localFilesInfo)}</OptionTooltip>,
                    localFileTime: () => <OptionTag>{t(msg => msg.option.statistics.localFileTime)}</OptionTag>,
                }}
            >
                <ElSwitch
                    modelValue={option.countLocalFiles}
                    onChange={(val: boolean) => option.countLocalFiles = val}
                />
            </OptionItem>
            <OptionItem
                label={msg => msg.option.statistics.collectSiteName}
                defaultValue={t(msg => msg.option.yes)}
                v-slots={{
                    siteName: () => <OptionTag>{t(msg => msg.option.statistics.siteName)}</OptionTag>,
                    siteNameUsage: () => <OptionTooltip>{t(msg => msg.option.statistics.siteNameUsage)}</OptionTooltip>,
                }}
            >
                <ElSwitch
                    modelValue={option.collectSiteName}
                    onChange={(val: boolean) => option.collectSiteName = val}
                />
            </OptionItem>
        </>
    }
})

export default _default