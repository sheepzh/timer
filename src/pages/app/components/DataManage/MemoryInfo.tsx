/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { getUsedStorage } from "@db/memory-detector"
import { useRequest } from "@hooks"
import { ElAlert, ElCard, ElProgress } from "element-plus"
import { computed, defineComponent } from "vue"
import { alertProps } from "./common"

export type MemoryInfoInstance = {
    refresh(): void
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
        const { data, refresh } = useRequest(getUsedStorage, { defaultValue: { used: 0, total: 1 } })
        ctx.expose({ refresh } as MemoryInfoInstance)

        const usedMb = computed(() => byte2Mb(data.value?.used))
        const totalMb = computed(() => byte2Mb(data.value?.total))
        const percentage = computed(() => data.value?.total ? Math.round(data.value?.used * 10000.0 / data.value.total) / 100 : 0)
        const color = computed(() => computeColor(percentage.value, data.value.total))

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