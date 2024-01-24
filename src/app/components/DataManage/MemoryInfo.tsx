/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert, ElCard, ElProgress } from "element-plus"
import { computed, ComputedRef, defineComponent, onMounted, ref, Ref } from "vue"
import { t } from "@app/locale"
import { alertProps } from "./common"
import { getUsedStorage } from "@db/memory-detector"

export type MemoryInfoInstance = {
    queryData(): void
}

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
const totalTitle = (totalMb: number) => totalMb
    ? t(msg => msg.dataManage.totalMemoryAlert, { size: totalMb })
    : t(msg => msg.dataManage.totalMemoryAlert1)

const _default = defineComponent({
    setup(_, ctx) {
        // Total memory with byte
        const used: Ref<number> = ref(0)
        // As the denominator of percentage, cannot be 0, so be 1
        const total: Ref<number> = ref(1)
        const queryData = async () => {
            const { used: currentUsed, total: currentTotal } = await getUsedStorage()
            used.value = currentUsed || 0
            total.value = currentTotal
        }

        const instance: MemoryInfoInstance = { queryData }
        ctx.expose(instance)

        onMounted(queryData)

        const usedMb: ComputedRef<number> = computed(() => byte2Mb(used.value))
        const totalMb: ComputedRef<number> = computed(() => byte2Mb(total.value))
        const percentage: ComputedRef<number> = computed(() => total.value ? Math.round(used.value * 10000.0 / total.value) / 100 : 0)
        const color: ComputedRef<string> = computed(() => computeColor(percentage.value, total.value))

        return () => (
            <ElCard>
                <ElAlert
                    {...alertProps}
                    type={totalMb.value ? "info" : "warning"}
                    title={totalTitle(totalMb.value)}
                />
                <div style={{ height: '260px', paddingTop: '50px' }}>
                    <ElProgress
                        strokeWidth={15}
                        percentage={percentage.value}
                        type="circle"
                        color={color.value}
                    />
                </div>
                <div style={{ userSelect: 'none' }}>
                    <h3 style={{ color: color.value }}>
                        {t(msg => msg.dataManage.usedMemoryAlert, { size: usedMb.value })}
                    </h3>
                </div>
            </ElCard>
        )
    }
})

export default _default