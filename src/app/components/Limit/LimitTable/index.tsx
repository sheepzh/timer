/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ElIcon, ElTable, ElTableColumn, ElTag, ElTooltip } from "element-plus"
import { defineComponent, PropType } from "vue"
import { t } from "@app/locale"
import { formatPeriod, formatPeriodCommon, MILL_PER_SECOND } from "@util/time"
import { ElTableRowScope } from "@src/element-ui/table"
import { period2Str } from "@util/limit"
import LimitDelayColumn from "./column/LimitDelayColumn"
import LimitEnabledColumn from "./column/LimitEnabledColumn"
import LimitOperationColumn from "./column/LimitOperationColumn"
import { InfoFilled } from "@element-plus/icons-vue"
import ColumnHeader from "@app/components/common/ColumnHeader"
import weekHelper from "@service/components/week-helper"
import { useRequest } from "@hooks"

const ALL_WEEKDAYS = t(msg => msg.calendar.weekDays)?.split('|')

const renderWeekdays = (weekdays: number[]) => {
    const len = weekdays?.length
    if (!len || len === 7) {
        return (
            <ElTag size="small" type="success">
                {t(msg => msg.calendar.range.everyday)}
            </ElTag>
        )
    }

    return (
        <div style={{ display: "flex", gap: '5px', justifyContent: 'center', margin: "0 10px", flexWrap: "wrap" }}>
            {weekdays.map(w => <ElTag size="small">{ALL_WEEKDAYS[w]}</ElTag>)}
        </div>
    )
}

const timeMsg = {
    hourMsg: '{hour}h{minute}m{second}s',
    minuteMsg: '{minute}m{second}s',
    secondMsg: '{second}s',
}

const renderDetail = (row: timer.limit.Item) => {
    const { time, weekly, visitTime, periods } = row
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: "4px" }}>
            {!!time && (
                <div>
                    <ElTag size="small">
                        {t(msg => msg.limit.item.time)}: {formatPeriod(time * MILL_PER_SECOND, timeMsg)}
                    </ElTag>
                </div>
            )}
            {!!weekly && (
                <div>
                    <ElTag size="small">
                        {t(msg => msg.limit.item.weekly)}: {formatPeriod(weekly * MILL_PER_SECOND, timeMsg)}
                    </ElTag>
                </div>
            )}
            {!!visitTime && (
                <div>
                    <ElTag size="small">
                        {t(msg => msg.limit.item.visitTime)}: {formatPeriod(visitTime * MILL_PER_SECOND, timeMsg)}
                    </ElTag>
                </div>
            )}
            {!!periods?.length && <>
                <div>
                    <ElTag size="small" type="info">{t(msg => msg.limit.item.period)}</ElTag>
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: '4px', flexWrap: 'wrap' }}>
                    {periods.map(p => <ElTag size="small" type="info">{period2Str(p)}</ElTag>)}
                </div>
            </>}
        </div>
    )
}

const renderToday = (row: timer.limit.Item) => {
    const { waste, delayCount, allowDelay } = row
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: "4px" }}>
            <div>
                {formatPeriodCommon(waste)}
            </div>
            {(!!allowDelay || !!delayCount) && (
                <div>
                    <ElTag size="small" type={delayCount ? 'danger' : 'info'}>
                        {t(msg => msg.limit.item.delayCount)}: {delayCount ?? 0}
                    </ElTag>
                </div>
            )}
        </div>
    )
}

const renderWeekly = (row: timer.limit.Item) => {
    const { weeklyWaste, weeklyDelayCount, allowDelay } = row
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: "4px" }}>
            <div>
                {formatPeriodCommon(weeklyWaste)}
            </div>
            {(!!allowDelay || !!weeklyDelayCount) && (
                <div>
                    <ElTag size="small" type={weeklyDelayCount ? 'danger' : 'info'}>
                        {t(msg => msg.limit.item.delayCount)}: {weeklyDelayCount ?? 0}
                    </ElTag>
                </div>
            )}
        </div>
    )
}

const _default = defineComponent({
    props: {
        data: Array as PropType<timer.limit.Item[]>
    },
    emits: {
        delayChange: (_row: timer.limit.Item) => true,
        enabledChange: (_row: timer.limit.Item) => true,
        delete: (_row: timer.limit.Item) => true,
        modify: (_row: timer.limit.Item) => true,
    },
    setup(props, ctx) {
        const { data: weekStartName } = useRequest(async () => {
            const offset = await weekHelper.getRealWeekStart()
            const name = t(msg => msg.calendar.weekDays)?.split('|')?.[offset]
            return name || 'NaN'
        })
        return () => (
            <ElTable border size="small" style={{ width: "100%" }} highlightCurrentRow fit data={props.data}>
                <ElTableColumn
                    label={t(msg => msg.limit.item.name)}
                    minWidth={140}
                    align="center"
                    formatter={({ name }: timer.limit.Item) => name || '-'}
                    fixed
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.condition)}
                    minWidth={200}
                    align="center"
                    formatter={({ cond }: timer.limit.Item) => <>{cond?.map?.(c => <span style={{ display: "block" }}>{c}</span>) || ''}</>}
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.effectiveDay)}
                    minWidth={180}
                    align="center"
                >
                    {({ row: { weekdays } }: ElTableRowScope<timer.limit.Item>) => renderWeekdays(weekdays)}
                </ElTableColumn>
                <ElTableColumn
                    label={t(msg => msg.limit.item.detail)}
                    minWidth={240}
                    align="center"
                >
                    {({ row }: ElTableRowScope<timer.limit.Item>) => renderDetail(row)}
                </ElTableColumn>
                <ElTableColumn
                    label={t(msg => msg.limit.item.waste)}
                    minWidth={110}
                    align="center"
                >
                    {({ row }: ElTableRowScope<timer.limit.Item>) => renderToday(row)}
                </ElTableColumn>
                <ElTableColumn
                    minWidth={110}
                    align="center"
                    v-slots={{
                        header: () => (
                            <ColumnHeader
                                label={t(msg => msg.limit.item.wasteWeekly)}
                                tooltipContent={t(msg => msg.limit.item.weekStartInfo, { weekStart: weekStartName.value })}
                            />
                        ),
                        default: ({ row }: ElTableRowScope<timer.limit.Item>) => renderWeekly(row),
                    }}
                />
                <LimitDelayColumn onRowChange={row => ctx.emit("delayChange", row)} />
                <LimitEnabledColumn onRowChange={row => ctx.emit("enabledChange", row)} />
                <LimitOperationColumn
                    onRowDelete={row => ctx.emit("delete", row)}
                    onRowModify={row => ctx.emit("modify", row)}
                />
            </ElTable>
        )
    }
})

export default _default

