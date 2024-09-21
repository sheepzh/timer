
/**
 * Copyright (c) 2024-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElLoading } from "element-plus"
import { type Ref, onMounted, ref, isRef, watch } from "vue"
import { AriaComponentOption, ComposeOption, init, ECharts } from "echarts"
import { useWindowSize } from "@vueuse/core"
import accessibilityHelper from "@service/components/accessibility-helper"

type BaseEchartsOption = ComposeOption<AriaComponentOption>

export const generateAriaOption = async (): Promise<AriaComponentOption> => {
    const { chartDecal } = await accessibilityHelper.getOption() || {}
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

export abstract class EchartsWrapper<BizOption, EchartsOption> {
    protected instance: ECharts
    /**
     * true if need to re-generate option while size changing, or false
     */
    protected isSizeSensitize: boolean = false
    private lastBizOption: BizOption

    init(container: HTMLDivElement) {
        this.instance = init(container)
        this.afterInit()
    }

    async render(biz: BizOption) {
        if (!this.instance) return
        this.lastBizOption = biz
        await this.innerRender()
    }

    private async innerRender() {
        const biz = this.lastBizOption
        const option = await this.generateOption(biz) as (EchartsOption & BaseEchartsOption)
        if (!option) return
        const aria = await generateAriaOption()
        option.aria = aria
        this.instance.setOption(option, { notMerge: false })
    }

    async resize() {
        if (!this.instance) return
        this.isSizeSensitize && await this.innerRender()
        this.instance.resize()
    }

    protected getDom(): HTMLElement {
        return this.instance?.getDom?.()
    }

    protected abstract generateOption(biz: BizOption): Promise<EchartsOption> | EchartsOption

    protected afterInit() {
    }

    protected getDomWidth(): number {
        return this.getDom()?.clientWidth ?? 0
    }
}


type WrapperResult<BizOption, EchartsOption, EW extends EchartsWrapper<BizOption, EchartsOption>> = {
    refresh: () => Promise<void>
    elRef: Ref<HTMLDivElement>
    wrapper: EW
}

export const useEcharts = <BizOption, EchartsOption, EW extends EchartsWrapper<BizOption, EchartsOption>>(
    Wrapper: new () => EW,
    fetch: (() => Promise<BizOption> | BizOption) | Ref<BizOption>,
    option?: {
        hideLoading?: boolean
        manual?: boolean
        watch?: boolean
    }): WrapperResult<BizOption, EchartsOption, EW> => {
    const elRef: Ref<HTMLDivElement> = ref()
    const wrapperInstance = new Wrapper()
    const {
        hideLoading = false,
        manual = false,
        watch: watchRef = true,
    } = option || {}

    let refresh = async () => {
        const loading = hideLoading ? null : ElLoading.service({ target: elRef.value })
        try {
            const option = isRef(fetch) ? fetch.value : await fetch()
            await wrapperInstance.render(option)
        } finally {
            loading?.close?.()
        }
    }
    onMounted(() => {
        const target = elRef.value
        wrapperInstance.init(target)
        !manual && refresh()
        watchRef && isRef(fetch) && watch(fetch, refresh)
    })

    const { width, height } = useWindowSize()
    watch([width, height], () => wrapperInstance?.resize?.())

    return {
        refresh,
        elRef,
        wrapper: wrapperInstance,
    }
}