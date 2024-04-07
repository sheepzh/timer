import { getCssVariable } from "@util/style"
import { rangeArr } from "element-plus"

export function getHeatColors(): string[] {
    return rangeArr(4)
        .map(idx => `--echart-heat-color-${idx + 1}`)
        .map(val => getCssVariable(val))
}

export const getSeriesPalette = (): string[] => {
    return rangeArr(4)
        .map(idx => `--echart-series-color-${idx + 1}`)
        .map(val => getCssVariable(val))
}

export const tooptipDot = (color: string) => {
    return `<div style="display:inline-block; background-color: ${color}; width: 8px; height: 8px; border-radius: 4px; margin-top: 1px; margin-bottom: 1px;"></div>`
}