/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ElOption, ElSelect, ElSwitch, ElTooltip } from "element-plus"
import optionService from "@service/option-service"
import { defaultStatistics } from "@util/constant/option"
import { defineComponent, reactive, unref, watch } from "vue"
import { t } from "@app/locale"
import { OptionInstance, OptionItem, OptionTag, OptionTooltip } from "../common"
import { useRequest } from "@hooks"
import { isAllowedFileSchemeAccess } from "@api/chrome/runtime"
import { IS_FIREFOX } from "@util/constant/environment"
import { rotate } from "@util/array"
import { locale } from "@i18n"

const weekStartOptionPairs: [[timer.option.WeekStartOption, string]] = [
    ['default', t(msg => msg.option.statistics.weekStartAsNormal)]
]
const allWeekDays = t(msg => msg.calendar.weekDays)
    .split('|')
    .map((weekDay, idx) => [idx + 1, weekDay] as [timer.option.WeekStartOption, string])
rotate(allWeekDays, locale === 'zh_CN' ? 0 : 1, true)
allWeekDays.forEach(weekDayInfo => weekStartOptionPairs.push(weekDayInfo))

function copy(target: timer.option.StatisticsOption, source: timer.option.StatisticsOption) {
    target.collectSiteName = source.collectSiteName
    target.countLocalFiles = source.countLocalFiles
    target.weekStart = source.weekStart
}

const _default = defineComponent((_props, ctx) => {
    const option = reactive(defaultStatistics())
    const { data: fileAccess } = useRequest(isAllowedFileSchemeAccess)
    optionService.getAllOption().then(currentVal => {
        copy(option, currentVal)
        watch(option, () => optionService.setStatisticsOption(unref(option)))
    })
    ctx.expose({
        reset: () => copy(option, defaultStatistics())
    } satisfies OptionInstance)
    return () => <>
        <OptionItem
            label={msg => msg.option.statistics.collectSiteName}
            defaultValue={t(msg => msg.option.yes)}
            hideDivider
            v-slots={{
                siteName: () => <OptionTag>{t(msg => msg.option.statistics.siteName)}</OptionTag>,
                siteNameUsage: () => <OptionTooltip>{t(msg => msg.option.statistics.siteNameUsage)}</OptionTooltip>,
                default: () => <ElSwitch
                    modelValue={option.collectSiteName}
                    onChange={(val: boolean) => option.collectSiteName = val}
                />
            }}
        />
        <OptionItem
            label={msg => msg.option.statistics.countLocalFiles}
            defaultValue={fileAccess.value ? t(msg => msg.option.yes) : null}
            v-slots={{
                info: () => <OptionTooltip>{t(msg => msg.option.statistics.localFilesInfo)}</OptionTooltip>,
                localFileTime: () => <OptionTag>{t(msg => msg.option.statistics.localFileTime)}</OptionTag>,
                default: () => fileAccess.value
                    ? <ElSwitch modelValue={option.countLocalFiles} onChange={(val: boolean) => option.countLocalFiles = val} />
                    : <ElTooltip
                        placement="top"
                        v-slots={{
                            content: () => IS_FIREFOX ? t(msg => msg.option.statistics.fileAccessFirefox) : t(msg => msg.option.statistics.fileAccessDisabled),
                            default: () => <ElSwitch modelValue={false} disabled />,
                        }}
                    />,
            }}
        />
        <OptionItem label={msg => msg.option.statistics.weekStart} defaultValue={t(msg => msg.option.statistics.weekStartAsNormal)}>
            <ElSelect
                modelValue={option.weekStart}
                size="small"
                onChange={(val: timer.option.WeekStartOption) => option.weekStart = val}
            >
                {weekStartOptionPairs.map(([val, label]) => <ElOption value={val} label={label} />)}
            </ElSelect>
        </OptionItem>
    </>
})

export default _default