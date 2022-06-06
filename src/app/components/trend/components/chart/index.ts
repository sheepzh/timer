/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComputedRef, Ref } from "vue"
import type { TimerQueryParam } from "@service/timer-service"

import { computed, defineComponent, h, onMounted, ref, watch } from "vue"
import timerService, { SortDirect } from "@service/timer-service"
import HostOptionInfo from "../../host-option-info"
import DataItem from "@entity/dto/data-item"
import ChartWrapper from "./wrapper"

const _default = defineComponent({
    name: "TrendChart",
    setup(_, ctx) {
        const elRef: Ref<HTMLDivElement> = ref()
        const host: Ref<HostOptionInfo> = ref(HostOptionInfo.empty())
        const dateRange: Ref<Array<Date>> = ref([])
        const chartWrapper: ChartWrapper = new ChartWrapper()

        const queryParam: ComputedRef<TimerQueryParam> = computed(() => ({
            // If the host is empty, no result will be queried with this param.
            host: host.value.host === '' ? '___foo_bar' : host.value.host,
            mergeHost: host.value.merged,
            fullHost: true,
            sort: 'date',
            sortOrder: SortDirect.ASC
        }))

        async function queryAndRender() {
            const row: DataItem[] = await timerService.select(queryParam.value)
            chartWrapper.render(host.value, dateRange.value, row)
        }

        watch(host, () => queryAndRender())
        watch(dateRange, () => queryAndRender())

        ctx.expose({
            setDomain: (key: string) => host.value = HostOptionInfo.from(key),
            setDateRange: (newVal: Date[]) => dateRange.value = newVal
        })

        onMounted(() => {
            chartWrapper.init(elRef.value)
            queryAndRender()
        })

        return () => h('div', { class: 'chart-container', ref: elRef })
    }
})

export default _default
