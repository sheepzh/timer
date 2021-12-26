/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard, ElDivider, ElSwitch } from "element-plus"
import optionService from "@service/option-service"
import { defaultStatistics } from "@util/constant/option"
import { defineComponent, h, Ref, ref } from "vue"
import { t } from "@app/locale"
import { renderHeader, renderOptionItem, tagText, tooltip } from "../common"

const optionRef: Ref<Timer.StatisticsOption> = ref(defaultStatistics())
optionService.getAllOption().then(option => optionRef.value = option)

function updateOptionVal(key: keyof Timer.StatisticsOption, newVal: boolean) {
    const value = optionRef.value
    value[key] = newVal
    optionService.setStatisticsOption(value)
}

const countWhenIdle = () => h(ElSwitch, {
    modelValue: optionRef.value.countWhenIdle,
    onChange: (newVal: boolean) => updateOptionVal('countWhenIdle', newVal)
})

const collectSiteName = () => h(ElSwitch, {
    modelValue: optionRef.value.collectSiteName,
    onChange: (newVal: boolean) => updateOptionVal('collectSiteName', newVal)
})

const options = () => [
    renderOptionItem({
        input: countWhenIdle(),
        idleTime: tagText(msg => msg.option.statistics.idleTime),
        info: tooltip(msg => msg.option.statistics.idleTimeInfo)
    }, msg => msg.statistics.countWhenIdle, t(msg => msg.option.no)),
    h(ElDivider),
    renderOptionItem({
        input: collectSiteName(),
        siteName: tagText(msg => msg.option.statistics.siteName),
        siteNameUsage: tooltip(msg => msg.option.statistics.siteNameUsage)
    }, msg => msg.statistics.collectSiteName, t(msg => msg.option.yes))
]

const _default = defineComponent(() => {
    return () => h(ElCard, {
    }, {
        header: () => renderHeader(
            msg => msg.statistics.title,
            () => optionService.setStatisticsOption(optionRef.value = defaultStatistics())),
        default: options
    })
})

export default _default