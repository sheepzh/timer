/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { UnwrapRef } from "vue"

import { ElDivider, ElSwitch } from "element-plus"
import optionService from "@service/option-service"
import { defaultStatistics } from "@util/constant/option"
import { defineComponent, h, reactive, unref } from "vue"
import { t } from "@app/locale"
import { renderOptionItem, tagText, tooltip } from "../common"

function updateOptionVal(key: keyof timer.option.StatisticsOption, newVal: boolean, option: UnwrapRef<timer.option.StatisticsOption>) {
    option[key] = newVal
    optionService.setStatisticsOption(unref(option))
}


const countLocalFiles = (option: UnwrapRef<timer.option.StatisticsOption>) => h(ElSwitch, {
    modelValue: option.countLocalFiles,
    onChange: (newVal: boolean) => updateOptionVal("countLocalFiles", newVal, option)
})

const collectSiteName = (option: UnwrapRef<timer.option.StatisticsOption>) => h(ElSwitch, {
    modelValue: option.collectSiteName,
    onChange: (newVal: boolean) => updateOptionVal('collectSiteName', newVal, option)
})

function copy(target: timer.option.StatisticsOption, source: timer.option.StatisticsOption) {
    target.collectSiteName = source.collectSiteName
    target.countLocalFiles = source.countLocalFiles
}

const _default = defineComponent({
    name: "StatisticsOptionContainer",
    setup(_props, ctx) {
        const option: UnwrapRef<timer.option.StatisticsOption> = reactive(defaultStatistics())
        optionService.getAllOption().then(currentVal => copy(option, currentVal))
        ctx.expose({
            async reset() {
                copy(option, defaultStatistics())
                await optionService.setStatisticsOption(unref(option))
            }
        })
        return () => h('div', [
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