
/**
 * Copyright (c) 2024-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElLoading } from "element-plus"
import { type Ref, onMounted, ref, isRef, watch } from "vue"
import { init, type ECharts } from "echarts"

export abstract class EchartsWrapper<BizOption, EchartsOption> {
    protected instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
        this.afterInit()
    }

    async render(biz: BizOption) {
        if (!this.instance) return
        const option = await this.generateOption(biz)
        this.instance.setOption(option, { notMerge: false })
    }

    protected getDom(): HTMLElement {
        return this.instance?.getDom?.()
    }

    protected abstract generateOption(biz: BizOption): Promise<EchartsOption> | EchartsOption

    protected afterInit() {
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
    return {
        refresh,
        elRef,
        wrapper: wrapperInstance,
    }
}