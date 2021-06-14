import { ElAlert, ElCard, ElProgress, ElRow, ElCol } from "element-plus"
import Filter from './filter'
import { computed, defineComponent, h, ref, Ref } from "vue"
import { getUsedStorage } from "../../../database/memory-detector"
import './style'
import { t } from "../../locale"

const byte2Mb = (size: number) => Math.round((size || 0) / 1024.0 / 1024.0 * 1000) / 1000

export default defineComponent(() => {
    // Total memory with byte
    const usedRef: Ref<number> = ref(0)
    const totalRef: Ref<number> = ref(1) // As the denominator of percentage, cannot be 0, so be 1

    const queryData =
        () => getUsedStorage()
            .then(({ used, total }) => {
                usedRef.value = used || 0
                totalRef.value = total || 1
            })

    queryData()

    // Computeds
    const totalMbRef = computed(() => byte2Mb(totalRef.value))
    const usedMbRef = computed(() => byte2Mb(usedRef.value))
    const percentageRef = computed(() => Math.round(usedRef.value * 10000.0 / totalRef.value) / 100)
    const typeColorRef = computed(() => {
        const percentage = percentageRef.value
        if (percentage < 50) {
            // Primary color
            return '#409EFF'
        } else if (percentage < 75) {
            // Warning color
            return '#E6A23C'
        } else {
            // Danger color
            return '#F56C6C'
        }
    })
    // memory info
    const memoryAlert = () => h(ElAlert, { showIcon: true, center: true, title: t(msg => msg.clear.totalMemoryAlert, { size: totalMbRef.value }) })
    const memoryProfress = () => h('div',
        { style: 'height:260px; padding-top:50px;' },
        h(ElProgress, { strokeWidth: 15, percentage: percentageRef.value, type: 'circle', color: typeColorRef.value })
    )
    const usedAlert = () => h('div',
        { style: 'user-select: none;' },
        h('h3',
            { style: `color:${typeColorRef.value};` },
            t(msg => msg.clear.usedMemoryAlert, { size: usedMbRef.value })
        )
    )

    const bodyStyle = { height: '450px', textAlign: 'center' }
    const memoryInfo = () => h(ElCard, { bodyStyle },
        () => [memoryAlert(), memoryProfress(), usedAlert()]
    )

    const clearAlert = () => h(ElAlert, { showIcon: true, center: true, title: t(msg => msg.clear.operationAlert), closable: false, type: 'info' })
    const clearFilter = () => h(Filter, { onDateChanged: queryData })
    const clearPanel = () => h(ElCard, { bodyStyle },
        () => [clearAlert(), clearFilter()]
    )

    return () => h('div',
        { class: 'content-container' },
        h(ElRow, { gutter: 20 },
            () => [
                h(ElCol, { span: 8 }, memoryInfo),
                h(ElCol, { span: 16 }, clearPanel)
            ]
        )
    )
})