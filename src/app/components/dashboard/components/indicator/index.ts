/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DataItem from "@entity/dto/data-item"
import metaService from "@service/meta-service"
import PeriodDatabase from "@db/period-database"
import timerService from "@service/timer-service"
import { getStartOfDay, MILL_PER_DAY } from "@util/time"
import { defineComponent, h, ref, Ref } from "vue"
import PeriodInfo, { MILL_PER_MINUTE } from "@entity/dto/period-info"
import { groupBy } from "@util/array"
import NumberGrow from "@app/components/common/number-grow"
import "./style"
import { tN } from "@app/locale"
import IndicatorHeaderIcon from "./header-icon"

const CONTAINER_ID = "__timer-indicator-container"

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
    const allData: DataItem[] = await timerService.select({})
    const hostSet = new Set<string>()
    let visits = 0
    let browsingTime = 0
    allData.forEach(({ host, focus, time }) => {
        hostSet.add(host)
        visits += time
        browsingTime += focus
    })
    const periodInfos: PeriodInfo[] = await periodDatabase.getAll()
    // Order [0, 95]
    const averageTimePerPeriod: { [order: number]: number } = groupBy(periodInfos,
        p => p.order,
        (grouped: PeriodInfo[]) => {
            const periodMills = grouped.map(p => p.milliseconds)
            if (!periodMills.length) {
                return 0
            }
            return Math.floor(periodMills.reduce((a, b) => a + b, 0) / periodMills.length)
        }
    )
    // Merged per 2 hours
    const averageTimePer2Hours: { [idx: number]: number } = groupBy(Object.entries(averageTimePerPeriod),
        ([order]) => Math.floor(parseInt(order) / 8),
        averages => averages.map(a => a[1]).reduce((a, b) => a + b, 0)
    )
    // The two most frequent online hours
    const most2Hour: number = parseInt(
        Object.entries(averageTimePer2Hours)
            .sort((a, b) => a[1] - b[1])
            .reverse()[0]?.[0]
    )

    const result: _Value = {
        sites: hostSet?.size || 0,
        visits,
        browsingTime,
        most2Hour
    }
    // 1. Get install time from metaService
    let installTime = await metaService.getInstallTime()
    if (!installTime) {
        // 2. if not exist, calculate from all data items
        const firstDate = allData.map(a => a.date).sort()[0]
        if (firstDate && firstDate.length === 8) {
            const year = parseInt(firstDate.substr(0, 4))
            const month = parseInt(firstDate.substr(4, 2)) - 1
            const date = parseInt(firstDate.substr(6, 2))
            installTime = new Date(year, month, date)
        }
    }
    installTime && (result.installedDays = calculateInstallDays(installTime, new Date()))
    return result
}


function renderInstalledDays(value: number) {
    return h('div',
        { class: 'indicator-label' },
        tN(msg => msg.dashboard.indicator.installedDays, {
            number: h(NumberGrow, { value, duration: 1.5 })
        })
    )
}

function renderVisits(siteNum: number, visitNum: number) {
    const duration = 1.75
    return h('div',
        { class: 'indicator-label' },
        tN(msg => msg.dashboard.indicator.visitCount, {
            visit: h(NumberGrow, { value: visitNum, duration }),
            site: h(NumberGrow, { value: siteNum, duration })
        })
    )
}

function renderBrowsingMinute(browsingMinute: number) {
    return h('div',
        { class: 'indicator-label' },
        tN(msg => msg.dashboard.indicator.browsingTime, {
            minute: h(NumberGrow, { value: browsingMinute, duration: 2 })
        })
    )
}

function renderMostUse(most2Hour: number) {
    const startHour = most2Hour * 2
    const endHour = most2Hour * 2 + 2
    const duration = 2.25
    return h('div',
        { class: 'indicator-label' },
        tN(msg => msg.dashboard.indicator.mostUse, {
            start: h(NumberGrow, { value: startHour, duration }),
            end: h(NumberGrow, { value: endHour, duration })
        })
    )
}

const _default = defineComponent({
    name: "Indicator",
    setup() {
        const installedDays: Ref<number> = ref()
        const siteCount: Ref<number> = ref(0)
        const visitCount: Ref<number> = ref(0)
        const browsingMinutes: Ref<number> = ref(0)
        const most2Hour: Ref<number> = ref(0)
        query().then(value => {
            installedDays.value = value.installedDays
            siteCount.value = value.sites
            visitCount.value = value.visits
            browsingMinutes.value = Math.floor(value.browsingTime / MILL_PER_MINUTE)
            most2Hour.value = value.most2Hour
        })
        return () => {
            const items = [
                renderVisits(siteCount.value, visitCount.value),
                renderBrowsingMinute(browsingMinutes.value),
                renderMostUse(most2Hour.value)
            ]
            const installedDaysVal = installedDays.value
            installedDaysVal && items.splice(0, 0, renderInstalledDays(installedDaysVal))
            return h('div', {
                id: CONTAINER_ID,
                class: 'chart-container'
            }, [
                h(IndicatorHeaderIcon),
                ...items
            ])
        }
    }
})

export default _default