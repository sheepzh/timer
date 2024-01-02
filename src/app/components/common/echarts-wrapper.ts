/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { init, type ECharts } from "echarts"

export abstract class EchartsWrapper<BizOption, EchartsOption> {
    private instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
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
}