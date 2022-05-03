/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDivider, ElSwitch } from "element-plus"
import optionService from "@service/option-service"
import { defaultStatistics } from "@util/constant/option"
import { defineComponent, h, Ref, ref } from "vue"
import { t } from "@app/locale"
import { renderOptionItem, tagText, tooltip } from "../common"

function updateOptionVal(key: keyof Timer.StatisticsOption, newVal: boolean, option: Ref<Timer.StatisticsOption>) {
    const value = option.value
    value[key] = newVal
    optionService.setStatisticsOption(value)
}

const countWhenIdle = (option: Ref<Timer.StatisticsOption>) => h(ElSwitch, {
    modelValue: option.value.countWhenIdle,
    onChange: (newVal: boolean) => updateOptionVal('countWhenIdle', newVal, option)
})

const countLocalFiles = (option: Ref<Timer.StatisticsOption>) => h(ElSwitch, {
    modelValue: option.value.countLocalFiles,
    onChange: (newVal: boolean) => updateOptionVal("countLocalFiles", newVal, option)
})

const collectSiteName = (option: Ref<Timer.StatisticsOption>) => h(ElSwitch, {
    modelValue: option.value.collectSiteName,
    onChange: (newVal: boolean) => updateOptionVal('collectSiteName', newVal, option)
})

const _default = defineComponent({
    name: "StatisticsOptionContainer",
    setup(_props, ctx) {
        const option: Ref<Timer.StatisticsOption> = ref(defaultStatistics())
        optionService.getAllOption().then(currentVal => option.value = currentVal)
        ctx.expose({
            async reset() {
                option.value = defaultStatistics()
                await optionService.setStatisticsOption(option.value)
            }
        })
        return () => h('div', [
            renderOptionItem({
                input: countWhenIdle(option),
                idleTime: tagText(msg => msg.option.statistics.idleTime),
                info: tooltip(msg => msg.option.statistics.idleTimeInfo)
            }, msg => msg.statistics.countWhenIdle, t(msg => msg.option.no)),
            h(ElDivider),
            renderOptionItem({
                input: countLocalFiles(option),
                localFileTime: tagText(msg => msg.option.statistics.localFileTime),
                info: tooltip(msg => msg.option.statistics.localFilesInfo)
            }, msg => msg.statistics.countLocalFiles, t(msg => msg.option.no)),
            h(ElDivider),
            renderOptionItem({
                input: collectSiteName(option),
                siteName: tagText(msg => msg.option.statistics.siteName),
                siteNameUsage: tooltip(msg => msg.option.statistics.siteNameUsage)
            }, msg => msg.statistics.collectSiteName, t(msg => msg.option.yes))
        ])
    }
})

export default _default