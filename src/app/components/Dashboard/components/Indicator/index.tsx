/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import PeriodDatabase from "@db/period-database"
import statService from "@service/stat-service"
import { getStartOfDay, MILL_PER_DAY, MILL_PER_MINUTE } from "@util/time"
import { computed, defineComponent, type PropType, type VNode } from "vue"
import NumberGrow from "@app/components/common/NumberGrow"
import "./style"
import { I18nKey } from "@app/locale"
import { calcMostPeriodOf2Hours } from "@util/period"
import I18nNode from "@app/components/common/I18nNode"
import { ElIcon } from "element-plus"
import { Sunrise } from "@element-plus/icons-vue"
import { useRequest, useShadow } from "@hooks"

const periodDatabase = new PeriodDatabase(chrome.storage.local)

type _Value = {
    installedDays?: number
    sites: number
    visits: number
    browsingTime: number
    most2Hour: number
}

/**
 * @return days used
 */
function calculateInstallDays(installTime: Date, now: Date): number {
    const deltaMills = getStartOfDay(now).getTime() - getStartOfDay(installTime).getTime()
    return Math.round(deltaMills / MILL_PER_DAY)
}

async function query(): Promise<_Value> {
    const allData: timer.stat.Row[] = await statService.select({ exclusiveVirtual: true })
    const hostSet = new Set<string>()
    let visits = 0
    let browsingTime = 0
    allData.forEach(({ host, focus, time }) => {
        hostSet.add(host)
        visits += time
        browsingTime += focus
    })
    const periodInfos: timer.period.Result[] = await periodDatabase.getAll()
    const most2Hour = calcMostPeriodOf2Hours(periodInfos)

    const result: _Value = {
        sites: hostSet?.size || 0,
        visits,
        browsingTime,
        most2Hour
    }
    let installTime = undefined
    // 2. if not exist, calculate from all data items
    const firstDate = allData.map(a => a.date).filter(d => d?.length === 8).sort()[0]
    if (firstDate) {
        const year = parseInt(firstDate.substring(0, 4))
        const month = parseInt(firstDate.substring(4, 6)) - 1
        const date = parseInt(firstDate.substring(6, 8))
        installTime = new Date(year, month, date)
    }

    installTime && (result.installedDays = calculateInstallDays(installTime, new Date()))
    return result
}

const computeI18nParam = (valueParam: Record<string, number>, duration: number): Record<string, VNode> => {
    return Object.fromEntries(
        Object.entries(valueParam || {}).map(([key, val]) => [key, <NumberGrow value={val} duration={duration} />])
    )
}

const IndicatorLabel = defineComponent({
    props: {
        path: {
            type: Function as PropType<I18nKey>,
            required: true,
        },
        param: {
            type: Object as PropType<Record<string, number>>,
            required: true,
        },
        duration: Number,
    },
    setup: props => {
        const [param] = useShadow(() => props.param)
        const i18nParam = computed(() => computeI18nParam(param.value, props.duration))
        return () => (
            <div class="indicator-label" >
                {
                    param.value && <I18nNode path={props.path} param={i18nParam.value} />
                }
            </div>
        )
    }
})

const computeMost2HourParam = (value: _Value): { start: number, end: number } => {
    const most2HourIndex = value?.most2Hour
    const [start, end] = most2HourIndex === undefined || isNaN(most2HourIndex)
        ? [0, 0]
        : [most2HourIndex * 2, most2HourIndex * 2 + 2]
    return { start, end }
}

const _default = defineComponent(() => {
    const { data } = useRequest(query)
    const most2HourParam = computed(() => computeMost2HourParam(data.value))

    return () => (
        <div class="indicator-container">
            <div class="indicator-icon-header">
                <ElIcon>
                    <Sunrise />
                </ElIcon>
            </div>
            <IndicatorLabel
                v-show={data.value?.installedDays}
                path={msg => msg.dashboard.indicator.installedDays}
                param={{ number: data.value?.installedDays || 0 }}
                duration={1.5}
            />
            <IndicatorLabel
                path={msg => msg.dashboard.indicator.visitCount}
                param={{ visit: data.value?.visits || 0, site: data.value?.sites || 0 }}
                duration={1.75}
            />
            <IndicatorLabel
                path={msg => msg.dashboard.indicator.browsingTime}
                param={{ minute: Math.floor((data.value?.browsingTime || 0) / MILL_PER_MINUTE) }}
                duration={2}
            />
            <IndicatorLabel
                path={msg => msg.dashboard.indicator.mostUse}
                param={most2HourParam.value}
                duration={2.25}
            />
        </div>
    )
})

export default _default
