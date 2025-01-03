/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { isAllowedFileSchemeAccess } from "@api/chrome/runtime"
import { t } from "@app/locale"
import { useRequest } from "@hooks"
import { locale } from "@i18n"
import optionService from "@service/option-service"
import { rotate } from "@util/array"
import { IS_FIREFOX } from "@util/constant/environment"
import { defaultStatistics } from "@util/constant/option"
import { MILL_PER_SECOND } from "@util/time"
import { ElOption, ElSelect, ElSwitch, ElTimePicker, ElTooltip } from "element-plus"
import { computed, defineComponent, onMounted, reactive, unref, watch } from "vue"
import { type OptionInstance } from "../common"
import OptionItem from "./OptionItem"
import OptionTag from "./OptionTag"
import OptionTooltip from "./OptionTooltip"

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
    target.autoPauseTracking = source.autoPauseTracking
    target.autoPauseInterval = source.autoPauseInterval
}

const _default = defineComponent((_props, ctx) => {
    const option = reactive(defaultStatistics())
    const { data: fileAccess } = useRequest(isAllowedFileSchemeAccess)
    onMounted(async () => {
        const currentVal = await optionService.getAllOption()
        copy(option, currentVal)
        watch(option, () => optionService.setStatisticsOption(unref(option)))
    })
    ctx.expose({
        reset: () => {
            const oldInterval = option.autoPauseInterval
            copy(option, defaultStatistics())
            option.autoPauseInterval = oldInterval
        }
    } satisfies OptionInstance)

    const interval = computed<number>({
        get: _oldValue => {
            const intervalNum = option.autoPauseInterval
            const now = new Date()
            now.setHours(0)
            now.setMinutes(0)
            now.setSeconds(0)
            return now.getTime() + intervalNum * MILL_PER_SECOND
        },
        set: val => {
            const date = new Date(val)
            const interval = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
            option.autoPauseInterval = Math.max(5, interval)
        },
    })

    const intervalFormat = computed(() => {
        const intervalNum = option.autoPauseInterval
        if (intervalNum > 3600) return 'HH [hr] mm [min] ss [sec]'
        if (intervalNum > 60) return 'mm [min] ss [sec]'
        return 'ss [sec]'
    })

    return () => <>
        <OptionItem
            label={msg => msg.option.statistics.autoPauseTrack}
            defaultValue={t(msg => msg.option.no)}
            hideDivider
            v-slots={{
                info: () => <OptionTooltip>{t(msg => msg.option.statistics.noActivityInfo)}</OptionTooltip>,
                maxTime: () => <ElTimePicker
                    size="small"
                    clearable={false}
                    disabled={!option.autoPauseTracking}
                    format={intervalFormat.value}
                    modelValue={interval.value}
                    onUpdate:modelValue={val => interval.value = val}
                    style={{ width: '150px' }}
                />,
                default: () => <ElSwitch
                    modelValue={option.autoPauseTracking}
                    onChange={(val: boolean) => option.autoPauseTracking = val}
                />
            }}
        />
        <OptionItem
            label={msg => msg.option.statistics.collectSiteName}
            defaultValue={t(msg => msg.option.yes)}
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
                style={{ width: '120px' }}
                onChange={(val: timer.option.WeekStartOption) => option.weekStart = val}
            >
                {weekStartOptionPairs.map(([val, label]) => <ElOption value={val} label={label} />)}
            </ElSelect>
        </OptionItem>
    </>
})

export default _default