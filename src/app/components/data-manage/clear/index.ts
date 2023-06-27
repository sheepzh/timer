/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert, ElCard, ElMessage, ElMessageBox } from "element-plus"
import { defineComponent, h, Ref, ref, SetupContext } from "vue"
import { t } from "@app/locale"
import { alertProps } from "../common"
import Filter from "./filter"
import StatDatabase, { StatCondition } from "@db/stat-database"
import { MILL_PER_DAY } from "@util/time"

type _Emits = {
    dataDelete: () => true
}

const statDatabase = new StatDatabase(chrome.storage.local)

const operationCancelMsg = t(msg => msg.button.cancel)
const operationConfirmMsg = t(msg => msg.button.confirm)

async function handleClick(filterRef: Ref, ctx: SetupContext<_Emits>) {
    const filterOption: DataManageClearFilterOption = filterRef?.value?.getFilterOption()
    const result: timer.stat.Row[] = await generateParamAndSelect(filterOption)

    const count = result.length
    const confirmMsg = t(msg => msg.dataManage.deleteConfirm, { count })
    ElMessageBox.confirm(confirmMsg, {
        cancelButtonText: operationCancelMsg,
        confirmButtonText: operationConfirmMsg
    }).then(async () => {
        await statDatabase.delete(result)
        ElMessage(t(msg => msg.dataManage.deleteSuccess))
        ctx.emit('dataDelete')
    }).catch(() => { })
}

function generateParamAndSelect(props: DataManageClearFilterOption): Promise<timer.stat.Row[]> | undefined {
    const condition = checkParam(props)
    if (!condition) {
        ElMessage({ message: t(msg => msg.dataManage.paramError), type: 'warning' })
        return
    }

    const { dateRange } = props
    let [dateStart, dateEnd] = dateRange || []
    if (dateEnd == null) {
        // default end time is the yesterday
        dateEnd = new Date(new Date().getTime() - MILL_PER_DAY)
    }
    condition.date = [dateStart, dateEnd]

    return statDatabase.select(condition)
}

/**
 * Assert query param with numeric range
 * 
 * @param range       numeric range, 2-length array
 * @param mustInteger must be integer?
 * @returns true when has error, or false
 */
function assertQueryParam(range: number[], mustInteger?: boolean): boolean {
    const reg = mustInteger ? /^[0-9]+$/ : /^[0-9]+.?[0-9]*$/
    const start = range[0]
    const end = range[1]
    const noStart = start !== undefined && start !== null
    const noEnd = end !== undefined && end !== null
    return (noStart && !reg.test(start.toString()))
        || (noEnd && !reg.test(end.toString()))
        || (noStart && noEnd && start > end)
}

const str2Num = (str: string, defaultVal?: number) => (str && str !== '') ? parseInt(str) : defaultVal
const seconds2Milliseconds = (a: number) => a * 1000

function checkParam(filterOption: DataManageClearFilterOption): StatCondition | undefined {
    const { focusStart, focusEnd, timeStart, timeEnd } = filterOption
    let hasError = false
    const focusRange = str2Range([focusStart, focusEnd], seconds2Milliseconds)
    hasError = hasError || assertQueryParam(focusRange)
    const timeRange = str2Range([timeStart, timeEnd])
    hasError = hasError || assertQueryParam(timeRange, true)
    if (hasError) {
        return undefined
    }
    const condition: StatCondition = {}
    condition.focusRange = focusRange
    condition.timeRange = timeRange
    return condition
}

function str2Range(startAndEnd: [string, string], numAmplifier?: (origin: number) => number): [number, number] {
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
        const filterRef: Ref = ref()
        return () => h(ElCard, {
            class: 'clear-container'
        }, () => [
            h(ElAlert, {
                ...alertProps,
                title: t(msg => msg.dataManage.operationAlert)
            }),
            h(Filter, {
                ref: filterRef,
                onDelete: () => handleClick(filterRef, ctx),
            }),
        ])
    }
})

export default _default