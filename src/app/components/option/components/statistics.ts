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
import { IS_SAFARI } from "@util/constant/environment"

function updateOptionVal(key: keyof timer.option.StatisticsOption, newVal: boolean, option: UnwrapRef<timer.option.StatisticsOption>) {
    option[key] = newVal
    optionService.setStatisticsOption(unref(option))
}

const countWhenIdle = (option: UnwrapRef<timer.option.StatisticsOption>) => h(ElSwitch, {
    modelValue: option.countWhenIdle,
    onChange: (newVal: boolean) => updateOptionVal('countWhenIdle', newVal, option)
})

const countLocalFiles = (option: UnwrapRef<timer.option.StatisticsOption>) => h(ElSwitch, {
    modelValue: option.countLocalFiles,
    onChange: (newVal: boolean) => updateOptionVal("countLocalFiles", newVal, option)
})

const collectSiteName = (option: UnwrapRef<timer.option.StatisticsOption>) => h(ElSwitch, {
    modelValue: option.collectSiteName,
    onChange: (newVal: boolean) => updateOptionVal('collectSiteName', newVal, option)
})

function copy(target: timer.option.StatisticsOption, source: timer.option.StatisticsOption) {
    target.countWhenIdle = source.countWhenIdle
    target.collectSiteName = source.collectSiteName
    target.countLocalFiles = source.countLocalFiles
}

function renderOptionItems(option: timer.option.StatisticsOption) {
    const result = []
    if (!IS_SAFARI) {
        // chrome.idle does not work in Safari, so not to display this option
        result.push(
            renderOptionItem({
                input: countWhenIdle(option),
                idleTime: tagText(msg => msg.option.statistics.idleTime),
                info: tooltip(msg => msg.option.statistics.idleTimeInfo)
            }, msg => msg.statistics.countWhenIdle, t(msg => msg.option.no)),
            h(ElDivider)
        )
    }
    result.push(
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
    )
    return result
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
        return () => h('div', renderOptionItems(option))
    }
})

export default _default