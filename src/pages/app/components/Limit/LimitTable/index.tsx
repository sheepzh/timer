/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import ColumnHeader from "@app/components/common/ColumnHeader"
import { t } from "@app/locale"
import { useManualRequest, useRequest, useWindowVisible } from "@hooks"
import { type ElTableRowScope } from "@pages/element-ui/table"
import weekHelper from "@service/components/week-helper"
import limitService from "@service/limit-service"
import { isEffective } from "@util/limit"
import { useLocalStorage } from "@vueuse/core"
import { ElMessage, ElTable, ElTableColumn, ElTag, type Sort, type TableInstance } from "element-plus"
import { defineComponent, ref } from "vue"
import { useLimitFilter } from "../context"
import LimitDelayColumn from "./column/LimitDelayColumn"
import LimitEnabledColumn from "./column/LimitEnabledColumn"
import LimitOperationColumn from "./column/LimitOperationColumn"
import RuleContent from "./RuleContent"
import Waste from "./Waste"
import Weekday from "./Weekday"

export type LimitSortProp = keyof Pick<timer.limit.Item, 'name' | 'weekdays' | 'waste' | 'weeklyWaste'>

const DEFAULT_SORT_COL = 'waste'

export type LimitTableInstance = {
    refresh: () => void
    getSelected: () => timer.limit.Item[]
}

const sortMethodByNumVal = (key: keyof timer.limit.Item & 'waste' | 'weeklyWaste'): (a: timer.limit.Item, b: timer.limit.Item) => number => {
    return ({ [key]: a }: timer.limit.Item, { [key]: b }: timer.limit.Item) => (a ?? 0) - (b ?? 0)
}

const sortByEffectiveDays = ({ weekdays: a }: timer.limit.Item, { weekdays: b }: timer.limit.Item) => (a?.length ?? 0) - (b?.length ?? 0)

const _default = defineComponent({
    emits: {
        delayChange: (_row: timer.limit.Item) => true,
        enabledChange: (_row: timer.limit.Item) => true,
        modify: (_row: timer.limit.Item) => true,
    },
    setup(_, ctx) {
        const { data: weekStartName } = useRequest(async () => {
            const offset = await weekHelper.getRealWeekStart()
            const name = t(msg => msg.calendar.weekDays)?.split('|')?.[offset]
            return name || 'NaN'
        })

        const filter = useLimitFilter()

        const { data, refresh } = useRequest(
            () => limitService.select({ filterDisabled: filter.value?.onlyEnabled, url: filter.value?.url || '' }),
            { defaultValue: [], deps: filter },
        )

        // Query data if the window become visible
        useWindowVisible({ onVisible: refresh })

        const { refresh: deleteRow } = useManualRequest((row: timer.limit.Item) => limitService.remove(row), {
            onSuccess() {
                ElMessage.success(t(msg => msg.operation.successMsg))
                refresh()
            }
        })

        const tableInstance = ref<TableInstance>()
        ctx.expose({
            refresh,
            getSelected: () => tableInstance.value?.getSelectionRows(),
        } satisfies LimitTableInstance)

        const historySort = useLocalStorage<Sort>('__limit_sort_default__', { prop: DEFAULT_SORT_COL, order: 'descending' })

        return () => (
            <ElTable
                ref={tableInstance}
                border
                fit
                highlightCurrentRow
                style={{ width: "100%" }}
                data={data.value}
                defaultSort={historySort.value}
                onSort-change={(val: Sort) => historySort.value = { prop: val?.prop, order: val?.order }}
            >
                <ElTableColumn type="selection" align="center" fixed="left" />
                <ElTableColumn
                    prop='name'
                    label={t(msg => msg.limit.item.name)}
                    minWidth={140}
                    align="center"
                    formatter={({ name }: timer.limit.Item) => name || '-'}
                    fixed
                    sortable
                    sortBy={(row: timer.limit.Item) => row.name}
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.condition)}
                    minWidth={200}
                    align="center"
                    formatter={({ cond }: timer.limit.Item) => <>{cond?.map?.(c => <span style={{ display: "block" }}>{c}</span>) || ''}</>}
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.detail)}
                    minWidth={240}
                    align="center"
                >
                    {({ row }: ElTableRowScope<timer.limit.Item>) => <RuleContent value={row} />}
                </ElTableColumn>
                <ElTableColumn
                    prop='effectiveDays'
                    label={t(msg => msg.limit.item.effectiveDay)}
                    minWidth={180}
                    align="center"
                    sortable
                    sortMethod={sortByEffectiveDays}
                >
                    {({ row: { weekdays } }: ElTableRowScope<timer.limit.Item>) => <Weekday value={weekdays} />}
                </ElTableColumn>
                <ElTableColumn
                    prop={DEFAULT_SORT_COL}
                    sortable
                    sortMethod={sortMethodByNumVal('waste')}
                    label={t(msg => msg.calendar.range.today)}
                    minWidth={110}
                    align="center"
                >
                    {({ row }: ElTableRowScope<timer.limit.Item>) => isEffective(row) ? (
                        <Waste
                            waste={row.waste}
                            time={row.time}
                            count={row.count}
                            visit={row.visit}
                            allowDelay={row.allowDelay}
                            delayCount={row.delayCount}
                        />
                    ) : (
                        <ElTag type="info" size="small">
                            {t(msg => msg.limit.item.notEffective)}
                        </ElTag>
                    )}
                </ElTableColumn>
                <ElTableColumn
                    prop='weeklyWaste'
                    minWidth={130}
                    align="center"
                    sortable
                    sortMethod={sortMethodByNumVal('weeklyWaste')}
                    v-slots={{
                        header: () => (
                            <ColumnHeader
                                label={t(msg => msg.calendar.range.thisWeek)}
                                tooltipContent={t(msg => msg.limit.item.weekStartInfo, { weekStart: weekStartName.value })}
                            />
                        ),
                        default: ({ row: {
                            weeklyWaste, weekly,
                            weeklyVisit, weeklyCount,
                            weeklyDelayCount, allowDelay,
                        } }: ElTableRowScope<timer.limit.Item>) => (
                            <Waste
                                time={weekly}
                                waste={weeklyWaste}
                                count={weeklyCount}
                                visit={weeklyVisit}
                                allowDelay={allowDelay}
                                delayCount={weeklyDelayCount}
                            />
                        ),
                    }}
                />
                <LimitDelayColumn onRowChange={row => ctx.emit("delayChange", row)} />
                <LimitEnabledColumn onRowChange={row => ctx.emit("enabledChange", row)} />
                <LimitOperationColumn
                    onRowDelete={deleteRow}
                    onRowModify={row => ctx.emit("modify", row)}
                />
            </ElTable>
        )
    }
})

export default _default

