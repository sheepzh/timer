import type { AriaComponentOption, ComposeOption, GridComponentOption, LegendComponentOption, PieSeriesOption, SeriesOption } from "echarts"
import { isRtl } from "./document"

export const processAria = (option: ComposeOption<AriaComponentOption>, chartDecal: boolean) => {
    if (!option) return
    const ariaOption = generateAriaOption(chartDecal)
    option.aria = ariaOption
}

const generateAriaOption = (chartDecal: boolean): AriaComponentOption => {
    if (!chartDecal) {
        return { enabled: false }
    }
    const color = "rgba(0, 0, 0, 0.2)"
    return {
        enabled: true,
        decal: {
            show: true,
            decals: [{
                color,
                dashArrayX: [1, 0],
                dashArrayY: [2, 5],
                rotation: .5235987755982988,
            }, {
                color,
                symbol: 'circle',
                dashArrayX: [[8, 8], [0, 8, 8, 0]],
                dashArrayY: [6, 0],
                symbolSize: .8,
            }, {
                color,
                dashArrayX: [1, 0],
                dashArrayY: [4, 3],
                rotation: -.7853981633974483
            }, {
                color,
                dashArrayX: [[6, 6], [0, 6, 6, 0]],
                dashArrayY: [6, 0],
            }, {
                color,
                dashArrayX: [[1, 0], [1, 6]],
                dashArrayY: [1, 0, 6, 0],
                rotation: .7853981633974483,
            }, {
                color,
                symbol: 'triangle',
                dashArrayX: [[9, 9], [0, 9, 9, 0]],
                dashArrayY: [7, 2],
                symbolSize: .75,
            }]
        }
    }
}

export const processRtl = (option: unknown) => {
    if (!isRtl() || !option) return

    const { grid, legend, series } = option as ComposeOption<
        | GridComponentOption | LegendComponentOption
        | PieSeriesOption
    >
    processArrayLike(grid, processGridRtl)
    processArrayLike(legend, processLegendRtl)
    processArrayLike(series, processSeriesRtl)
}

const processArrayLike = <T,>(arr: T | T[], processor: (t: T) => void) => {
    if (!arr) return
    if (Array.isArray(arr)) {
        arr.filter(e => !!e).forEach(processor)
    } else {
        processor?.(arr)
    }
}

const processGridRtl = (option: GridComponentOption) => {
    // Swap right and left
    swapPosition(option)
}

const processLegendRtl = (option: LegendComponentOption) => {
    swapPosition(option)
    swapAlign(option, 'align')
}

const processSeriesRtl = (option: PieSeriesOption) => {
    if (option.type === 'pie') {
        const center = option.center
        if (!Array.isArray(center)) return
        const left = center[0]
        if (typeof left !== 'string' || !left.endsWith('%')) return
        try {
            const originPercentStr = left.substring(0, left.length - 1)
            const originPercent = left.includes('.') ? parseFloat(originPercentStr) : parseInt(originPercentStr)
            center[0] = `${100 - originPercent}%`
        } catch (ignored) { }
    }
}

const swapAlign = <K extends string>(option: { [k in K]?: 'right' | 'left' | 'auto' }, key: K) => {
    const { [key]: align } = option || {}
    if (align === 'left') {
        option[key] = 'right'
    } else if (align === 'right') {
        option[key] = 'left'
    }
}

const swapPosition = (option: { left?: string | number, right?: string | number }) => {
    const right = option.right
    option.right = option.left
    option.left = right
}