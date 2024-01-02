/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { PropType, Ref, VNode } from "vue"

import { defineComponent, h, ref, watch } from "vue"
import siteService from "@service/site-service"
import Site from "./site"
import { KanbanIndicatorCell, KanbanCard, KanbanIndicatorRow } from "@app/components/common/kanban"
import "./summary.sass"
import { ElCol } from "element-plus"
import { t } from "@app/locale"
import { cvt2LocaleTime, periodFormatter } from "@app/util/time"

type Summary = {
    focus: number
    visit: number
    day: number
    firstDay?: string
}

function computeSummary(site: timer.site.SiteKey, rows: timer.stat.Row[]): Summary {
    if (!site) return undefined

    const summary: Summary = { focus: 0, visit: 0, day: 0 }
    summary.firstDay = rows?.[0]?.date
    rows?.forEach(({ focus, time: visit }) => {
        summary.focus += focus
        summary.visit += visit
        focus && (summary.day += 1)
    })
    return summary
}

const DAYS_LABEL = t(msg => msg.analysis.summary.day)
const FOCUS_LABEL = t(msg => msg.analysis.common.focusTotal)
const VISIT_LABEL = t(msg => msg.analysis.common.visitTotal)

function renderContent(siteInfo: timer.site.SiteInfo, summary: Summary, timeFormat: timer.app.TimeFormat): VNode {
    const { day, firstDay, focus, visit } = summary || {}
    return h(KanbanIndicatorRow, {}, () => [
        h(ElCol, { span: 6 }, () => h(Site, { site: siteInfo })),
        h(ElCol, { span: 6 }, () => h(KanbanIndicatorCell, {
            mainName: DAYS_LABEL,
            mainValue: day?.toString() || '-',
            subTips: msg => msg.analysis.summary.firstDay,
            subValue: firstDay ? `@${cvt2LocaleTime(firstDay)}` : ''
        })),
        h(ElCol, { span: 6 }, () => h(KanbanIndicatorCell, {
            mainName: FOCUS_LABEL,
            mainValue: focus === undefined ? '-' : periodFormatter(focus, timeFormat, false),
        })),
        h(ElCol, { span: 6 }, () => h(KanbanIndicatorCell, {
            mainName: VISIT_LABEL,
            mainValue: visit?.toString() || '-',
        })),
    ])
}

const _default = defineComponent({
    props: {
        site: Object as PropType<timer.site.SiteKey>,
        timeFormat: String as PropType<timer.app.TimeFormat>,
        rows: Array as PropType<timer.stat.Row[]>,
    },
    setup(props) {
        const siteInfo: Ref<timer.site.SiteInfo> = ref()
        const timeFormat: Ref<timer.app.TimeFormat> = ref(props.timeFormat)
        const summaryInfo: Ref<Summary> = ref(computeSummary(props.site, props.rows))

        const querySiteInfo = async () => {
            const siteKey = props.site
            if (!siteKey) {
                siteInfo.value = undefined
            } else {
                siteInfo.value = (await siteService.get(siteKey)) || siteKey
            }
        }

        watch(() => props.timeFormat, () => timeFormat.value = props.timeFormat)
        watch(() => props.site, querySiteInfo)
        watch(() => props.rows, () => summaryInfo.value = computeSummary(props.site, props.rows))

        querySiteInfo()

        return () => h(KanbanCard, {
            title: t(msg => msg.analysis.summary.title)
        }, () => renderContent(siteInfo.value, summaryInfo.value, timeFormat.value))
    }
})

export default _default