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