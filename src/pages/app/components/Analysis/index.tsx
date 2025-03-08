/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { useRequest, useState } from "@hooks"
import Flex from "@pages/components/Flex"
import statService, { type StatQueryParam } from "@service/stat-service"
import { defineComponent, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { type AnalysisQuery } from "./common"
import AnalysisFilter, { type AnalysisFilterInstance } from "./components/AnalysisFilter"
import Summary from "./components/Summary"
import Trend from "./components/Trend"
import { initProvider } from "./context"
import type { AnalysisTarget } from "./types"

function getTargetFromQuery(): AnalysisTarget {
    // Process the query param
    const query: AnalysisQuery = useRoute().query as unknown as AnalysisQuery
    useRouter().replace({ query: {} })
    const { host, type: siteType, cateId } = query
    if (cateId) return { type: 'cate', key: parseInt(cateId) }
    if (host && siteType) return { type: 'site', key: { host, type: siteType } }
    return undefined
}

async function query(target: AnalysisTarget): Promise<timer.stat.Row[]> {
    if (!target?.key) return []

    let param: StatQueryParam = {
        sort: 'date',
        sortOrder: 'ASC',
    }
    if (target?.type === 'cate') {
        param.cateIds = [target.key]
        param.mergeCate = true
    } else if (target?.type === 'site') {
        const { host, type: siteType } = target.key || {}
        param.host = host
        param.mergeHost = siteType === 'merged'
        param.fullHost = true
    } else {
        return []
    }

    return await statService.select(param)
}

const _default = defineComponent(() => {
    const [target, setTarget] = useState(getTargetFromQuery())
    const [timeFormat, setTimeFormat] = useState<timer.app.TimeFormat>('default')

    const { data: rows, loading } = useRequest(() => query(target.value), { deps: target })

    initProvider(target, timeFormat, rows)

    const filter = ref<AnalysisFilterInstance>()

    onMounted(() => !target.value && filter.value?.openTargetSelect?.())

    return () => <ContentContainer
        v-slots={{
            filter: () => (
                <AnalysisFilter
                    ref={filter}
                    target={target.value}
                    timeFormat={timeFormat.value}
                    onTargetChange={setTarget}
                    onTimeFormatChange={setTimeFormat}
                />
            ),
            default: () => (
                <Flex v-loading={loading.value} direction="column" gap={15}>
                    <Summary />
                    <Trend />
                </Flex>
            )
        }}
    />
})

export default _default
