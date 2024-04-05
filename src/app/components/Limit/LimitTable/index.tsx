/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTable, ElTableColumn } from "element-plus"
import { defineComponent, PropType } from "vue"
import { t } from "@app/locale"
import { formatPeriodCommon } from "@util/time"
import { ElTableRowScope } from "@src/element-ui/table"
import { period2Str } from "@util/limit"
import LimitDelayColumn from "./column/LimitDelayColumn"
import LimitEnabledColumn from "./column/LimitEnabledColumn"
import LimitOperationColumn from "./column/LimitOperationColumn"

const renderCond = (cond: string[]) => {
    if (!cond?.length) return ""
    return <>
        {cond.map(c => <span style={{ display: "block" }}>{c}</span>)}
    </>
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
        return () => (
            <ElTable border size="small" style={{ width: "100%" }} highlightCurrentRow fit data={props.data}>
                <ElTableColumn
                    label={t(msg => msg.limit.item.name)}
                    minWidth={160}
                    align="center"
                    formatter={({ name }: timer.limit.Item) => name || '-'}
                    fixed
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.condition)}
                    minWidth={320}
                    align="center"
                    formatter={({ cond }: timer.limit.Item) => renderCond(cond)}
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.time)}
                    minWidth={110}
                    align="center"
                    formatter={({ time }: timer.limit.Item) => time ? formatPeriodCommon(time * 1000) : '-'}
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.waste)}
                    minWidth={110}
                    align="center"
                    formatter={({ waste }: timer.limit.Item) => formatPeriodCommon(waste)}
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.visitTime)}
                    minWidth={110}
                    align="center"
                    formatter={({ visitTime }: timer.limit.Item) => visitTime ? formatPeriodCommon(visitTime * 1000) : '-'}
                />
                <ElTableColumn
                    label={t(msg => msg.limit.item.period)}
                    minWidth={110}
                    align="center"
                >
                    {({ row: { periods } }: ElTableRowScope<timer.limit.Item>) =>
                        periods?.length
                            ? <div>
                                {periods.map(p => <span style={{ display: "block" }}>{period2Str(p)}</span>)}
                            </div>
                            : '-'
                    }
                </ElTableColumn>
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

