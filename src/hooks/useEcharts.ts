
/**
 * Copyright (c) 2024-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElLoading } from "element-plus"
import { type Ref, onMounted, ref, isRef, watch } from "vue"
import { init, type ECharts } from "echarts"
import { useWindowSize } from "@vueuse/core"

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
        const option = await this.generateOption(biz)
        if (!option) return
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