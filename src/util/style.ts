/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function getCssVariable(varName: string, ele?: HTMLElement): string {
    const realEle = ele || document.documentElement
    if (!realEle) {
        return undefined
    }
    return getComputedStyle(ele || document.documentElement).getPropertyValue(varName)
}

export function getPrimaryTextColor(): string {
    return getCssVariable("--el-text-color-primary")
}

export function getSecondaryTextColor(): string {
    return getCssVariable("--el-text-color-secondary")
}