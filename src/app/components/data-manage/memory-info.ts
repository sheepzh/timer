/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert, ElCard, ElProgress } from "element-plus"
import { computed, ComputedRef, defineComponent, h, ref, Ref } from "vue"
import { t } from "@app/locale"
import { alertProps } from "./common"
import { getUsedStorage } from "@db/memory-detector"

export type MemeryInfoInstance = {
    queryData(): void
}

const memoryAlert = (totalMb: number) => {
    const title = totalMb
        ? t(msg => msg.dataManage.totalMemoryAlert, { size: totalMb })
        : t(msg => msg.dataManage.totalMemoryAlert1)
    const props = { ...alertProps, title }
    !totalMb && (props.type = 'warning')
    return h(ElAlert, props)
}

const progressStyle: Partial<CSSStyleDeclaration> = {
    height: '260px',
    paddingTop: '50px'
}
const memoryProgress = (percentage: number, typeColor: string) =>
    h('div', { style: progressStyle },
        h(ElProgress, { strokeWidth: 15, percentage, type: 'circle', color: typeColor })
    )

const usedAlertStyle: Partial<CSSStyleDeclaration> = {
    userSelect: 'none'
}
const usedAlert = (usedMb: number, typeColor: string) => h('div', { style: usedAlertStyle },
    h('h3',
        { style: `color:${typeColor}` },
        t(msg => msg.dataManage.usedMemoryAlert, { size: usedMb })
    )
)

const byte2Mb = (size: number) => Math.round((size || 0) / 1024.0 / 1024.0 * 1000) / 1000

function computeColor(percentage: number, total: number): string {
    // Danger color
    let typeColor = '#F56C6C'
    // Primary color
    if (percentage < 50) typeColor = '#409EFF'
    // Warning color
    else if (percentage < 75) typeColor = '#E6A23C'
    // Specially, show warning color if not detect the max memory
    if (!total) typeColor = '#E6A23C'
    return typeColor
}

const _default = defineComponent({
    setup(_, ctx) {
        // Total memory with byte
        const usedRef: Ref<number> = ref(0)
        // As the denominator of percentage, cannot be 0, so be 1
        const totalRef: Ref<number> = ref(1)
        const queryData = async () => {
            const { used, total } = await getUsedStorage()
            usedRef.value = used || 0
            totalRef.value = total
        }

        const instance: MemeryInfoInstance = { queryData }
        ctx.expose(instance)

        queryData()

        const usedMbRef: ComputedRef<number> = computed(() => byte2Mb(usedRef.value))
        const totalMbRef: ComputedRef<number> = computed(() => byte2Mb(totalRef.value))
        const percentageRef: ComputedRef<number> = computed(() => totalRef.value ? Math.round(usedRef.value * 10000.0 / totalRef.value) / 100 : 0)
        const colorRef: ComputedRef<string> = computed(() => computeColor(percentageRef.value, totalRef.value))

        return () => h(ElCard, {},
            () => [memoryAlert(totalMbRef.value), memoryProgress(percentageRef.value, colorRef.value), usedAlert(usedMbRef.value, colorRef.value)]
        )
    },
})

export default _default