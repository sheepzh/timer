/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { camelize, type CSSProperties } from "vue"

export const getStyle = (
    element: HTMLElement,
    styleName: keyof CSSProperties
): string => {
    if (!element || !styleName) return ''

    let key = camelize(styleName)
    if (key === 'float') key = 'cssFloat'
    try {
        const style = (element.style as any)[key]
        if (style) return style
        const computed: any = document.defaultView?.getComputedStyle(element, '')
        return computed ? computed[key] : ''
    } catch {
        return (element.style as any)[key]
    }
}

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

export function getRegularTextColor(): string {
    return getCssVariable("--el-text-color-regular")
}

export function getSecondaryTextColor(): string {
    return getCssVariable("--el-text-color-secondary")
}

export function getInfoColor(): string {
    return getCssVariable("--el-color-info")
}

export function classNames(...names: (string | boolean | number)[]): string {
    return names?.filter(n => typeof n === 'string' && n).join(' ')
}