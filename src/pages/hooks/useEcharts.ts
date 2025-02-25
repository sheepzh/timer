
/**
 * Copyright (c) 2024-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import optionHolder from "@service/components/option-holder"
import { processAnimation, processAria, processRtl } from "@util/echarts"
import { useWindowSize } from "@vueuse/core"
import { type AriaComponentOption, type ComposeOption } from "echarts"
import { type ECharts, init } from "echarts/core"
import { ElLoading } from "element-plus"
import { type Ref, isRef, onMounted, ref, watch } from "vue"

type BaseEchartsOption = ComposeOption<AriaComponentOption>

export abstract class EchartsWrapper<BizOption, EchartsOption> {
    public instance: ECharts
    /**
     * true if need to re-generate option while size changing, or false
     */
    protected isSizeSensitize: boolean = false
    private lastBizOption: BizOption

    init(container: HTMLDivElement) {
        this.instance = init(container)
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

        await this.postChartOption(option)

        this.instance.setOption(option, { notMerge: false })
    }

    protected async postChartOption(option: EchartsOption & BaseEchartsOption) {
        const { chartDecal, chartAnimationDuration } = await optionHolder.get() || {}
        processAnimation(option, chartAnimationDuration)
        processAria(option, chartDecal)
        processRtl(option)
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
        afterInit?: (ew: EW) => void
    }): WrapperResult<BizOption, EchartsOption, EW> => {
    const elRef: Ref<HTMLDivElement> = ref()
    const wrapperInstance = new Wrapper()
    const {
        hideLoading = false,
        manual = false,
        watch: watchRef = true,
        afterInit,
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
        afterInit?.(wrapperInstance)
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