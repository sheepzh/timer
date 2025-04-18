import { judgeVirtualFast } from "@util/pattern"

export function cvt2StatRow(rowBase: timer.core.Row): timer.stat.Row {
    const { host, ...otherFields } = rowBase
    return {
        siteKey: { host, type: judgeVirtualFast(host) ? 'virtual' : 'normal' },
        ...otherFields,
    }
}