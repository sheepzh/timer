/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import ColumnHeader from "@app/components/common/ColumnHeader"
import TooltipWrapper from "@app/components/common/TooltipWrapper"
import { t } from "@app/locale"
import { useRequest } from "@hooks"
import Flex from "@pages/components/Flex"
import { type ElTableRowScope } from "@pages/element-ui/table"
import weekHelper from "@service/components/week-helper"
import { period2Str } from "@util/limit"
import { formatPeriod, formatPeriodCommon, MILL_PER_SECOND } from "@util/time"
import { ElTable, ElTableColumn, ElTag } from "element-plus"
import { defineComponent, type PropType } from "vue"
import LimitDelayColumn from "./column/LimitDelayColumn"
import LimitEnabledColumn from "./column/LimitEnabledColumn"
import LimitOperationColumn from "./column/LimitOperationColumn"

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
        <Flex justify="center" wrap="wrap" gap={5} style={{ margin: "0 10px" }}>
            {weekdays.map(w => <ElTag size="small">{ALL_WEEKDAYS[w]}</ElTag>)}
        </Flex>
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
        <Flex direction="column" gap={4}>
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
                <Flex justify="center" gap={4} wrap="wrap">
                    {periods.map(p => <ElTag size="small" type="info">{period2Str(p)}</ElTag>)}
                </Flex>
            </>}
        </Flex>
    )
}

const Waste = defineComponent({
    props: {
        value: Number,
        delayCount: Number,
        showPopover: Boolean,
    },
    setup(props) {
        return () => (
            <TooltipWrapper
                trigger="hover"
                showPopover={props.showPopover}
                placement="top"
                v-slots={{
                    content: () => `${t(msg => msg.limit.item.delayCount)}: ${props.delayCount ?? 0}`,
                    default: () => (
                        <ElTag size="small" type={props.value ? 'warning' : 'info'}>
                            {formatPeriodCommon(props.value)}
                        </ElTag>
                    ),
                }}
            />
        )
    },
})

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
            <ElTable border style={{ width: "100%" }} highlightCurrentRow fit data={props.data}>
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
                    {({ row: { waste, delayCount, allowDelay } }: ElTableRowScope<timer.limit.Item>) => (
                        <Waste
                            value={waste}
                            showPopover={!!allowDelay || !!delayCount}
                            delayCount={delayCount}
                        />
                    )}
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
                        default: ({ row: { weeklyWaste, weeklyDelayCount, allowDelay } }: ElTableRowScope<timer.limit.Item>) => (
                            <Waste
                                value={weeklyWaste}
                                showPopover={!!allowDelay || !!weeklyDelayCount}
                                delayCount={weeklyDelayCount}
                            />
                        ),
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

