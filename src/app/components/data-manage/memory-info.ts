/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAlert, ElCard, ElProgress } from "element-plus"
import { h, Ref } from "vue"
import { t } from "@app/locale"
import { alertProps, bodyStyle } from "./common"

type _Props = {
    usedRef: Ref<number>
    totalRef: Ref<number>
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
const memoryInfo = (props: _Props) => {
    const { usedRef, totalRef } = props
    const used = usedRef.value
    const total = totalRef.value
    const usedMb = byte2Mb(used)
    const totalMb = byte2Mb(total)
    const percentage: number = total ? Math.round(used * 10000.0 / total) / 100 : 0
    // Danger color
    let typeColor = '#F56C6C'
    // Primary color
    if (percentage < 50) typeColor = '#409EFF'
    // Warning color
    else if (percentage < 75) typeColor = '#E6A23C'
    // Specially, show warning color if not detect the max memory
    if (!total) typeColor = '#E6A23C'
    return h(ElCard,
        { bodyStyle },
        () => [memoryAlert(totalMb), memoryProgress(percentage, typeColor), usedAlert(usedMb, typeColor)]
    )
}

export default memoryInfo