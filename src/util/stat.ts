import { identifySiteKey } from "./site"

/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
export function isNotZeroResult(target: timer.core.Result): boolean {
    return !!target.focus || !!target.time
}

export function resultOf(focus: number, time: number): timer.core.Result {
    return { focus, time }
}

export const ALL_DIMENSIONS: timer.core.Dimension[] = ['focus', 'time']

export function identifyTargetKey(targetKey: timer.stat.TargetKey): string {
    if ('cateKey' in targetKey) {
        return `cate_${targetKey.cateKey}`
    } else if ('siteKey' in targetKey) {
        return identifySiteKey(targetKey.siteKey)
    } else {
        return `group_${targetKey.groupKey}`
    }
}

export function identifyStatKey(rowKey: timer.stat.StatKey) {
    const { date } = rowKey || {}

    return [identifyTargetKey(rowKey), date ?? ''].join('_')
}

export const isNormalSite = (row: timer.stat.Row): row is timer.stat.Row & timer.stat.SiteTarget => {
    return 'siteKey' in row && row.siteKey.type === 'normal'
}

export const isGroup = (row: timer.stat.Row): row is timer.stat.Row & timer.stat.GroupTarget => {
    return 'groupKey' in row
}

export const isSite = (row: timer.stat.Row): row is timer.stat.Row & timer.stat.SiteTarget => {
    return 'siteKey' in row
}

export const isCate = (row: timer.stat.Row): row is timer.stat.Row & timer.stat.CateTarget => {
    return 'cateKey' in row
}

export const getHost = (row: timer.stat.Row): string | undefined => {
    return 'siteKey' in row ? row.siteKey.host : undefined
}