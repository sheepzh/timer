/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert, ElCard, ElMessage, ElMessageBox } from "element-plus"
import { defineComponent } from "vue"
import { t } from "@app/locale"
import { alertProps } from "../common"
import ClearFilter from "./ClearFilter"
import { MILL_PER_DAY, MILL_PER_SECOND } from "@util/time"
import statService, { StatQueryParam } from "@service/stat-service"

type FilterOption = {
    date: [Date, Date]
    focus: [string, string]
    time: [string, string]
}

function generateParamAndSelect(option: FilterOption): Promise<timer.stat.Row[]> | undefined {
    const param = checkParam(option)
    if (!param) {
        ElMessage.warning(t(msg => msg.dataManage.paramError))
        return
    }

    const { date } = option
    let [dateStart, dateEnd] = date || []
    if (dateEnd == null) {
        // default end time is the yesterday
        dateEnd = new Date(new Date().getTime() - MILL_PER_DAY)
    }
    param.date = [dateStart, dateEnd]
    return statService.select(param)
}

/**
 * Assert query param with numeric range
 *
 * @param range       numeric range, 2-length array
 * @param mustInteger must be integer?
 * @returns true when has error, or false
 */
function assertQueryParam(range: Vector<2>, mustInteger?: boolean): boolean {
    const reg = mustInteger ? /^[0-9]+$/ : /^[0-9]+.?[0-9]*$/
    const [start, end] = range || []
    const noStart = start !== undefined && start !== null
    const noEnd = end !== undefined && end !== null
    return (noStart && !reg.test(start.toString()))
        || (noEnd && !reg.test(end.toString()))
        || (noStart && noEnd && start > end)
}

const str2Num = (str: string, defaultVal?: number) => (str && str !== '') ? parseInt(str) : defaultVal
const seconds2Milliseconds = (a: number) => a * MILL_PER_SECOND

function checkParam(option: FilterOption): StatQueryParam | undefined {
    const { focus = [null, null], time = [null, null] } = option || {}
    let hasError = false
    const focusRange = str2Range(focus, seconds2Milliseconds)
    hasError = hasError || assertQueryParam(focusRange)
    const timeRange = str2Range(time)
    hasError = hasError || assertQueryParam(timeRange, true)
    if (hasError) {
        return undefined
    }
    const condition: StatQueryParam = {}
    condition.focusRange = focusRange
    condition.timeRange = timeRange
    return condition
}

function str2Range(startAndEnd: [string, string], numAmplifier?: (origin: number) => number): Vector<2> {
    const startStr = startAndEnd[0]
    const endStr = startAndEnd[1]
    let start = str2Num(startStr, 0)
    numAmplifier && (start = numAmplifier(start))
    let end = str2Num(endStr)
    end && numAmplifier && (end = numAmplifier(end))
    return [start, end]
}

const _default = defineComponent({
    emits: {
        dataDelete: () => true
    },
    setup(_, ctx) {
        async function handleClick(option: FilterOption) {
            const result: timer.stat.Row[] = await generateParamAndSelect(option)

            const count = result.length
            const confirmMsg = t(msg => msg.dataManage.deleteConfirm, { count })
            ElMessageBox.confirm(confirmMsg, {
                cancelButtonText: t(msg => msg.button.cancel),
                confirmButtonText: t(msg => msg.button.confirm)
            }).then(async () => {
                await statService.batchDelete(result)
                ElMessage.success(t(msg => msg.operation.successMsg))
                ctx.emit('dataDelete')
            }).catch(() => { })
        }

        return () => (
            <ElCard class="clear-container">
                <ElAlert {...alertProps} title={t(msg => msg.dataManage.operationAlert)} />
                <ClearFilter onDelete={(date, focus, time) => handleClick({ date, focus, time })} />
            </ElCard>
        )
    }
})

export default _default