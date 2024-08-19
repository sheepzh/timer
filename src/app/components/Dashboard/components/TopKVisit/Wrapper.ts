/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { ComposeOption } from "echarts/core"
import type { PieSeriesOption } from "echarts/charts"
import type { TitleComponentOption, TooltipComponentOption } from "echarts/components"

import { use } from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent } from "echarts/components"
import { SVGRenderer } from "echarts/renderers"
import { EchartsWrapper } from "@hooks/useEcharts"
import { getPrimaryTextColor } from "@util/style"
import { BASE_TITLE_OPTION } from "../../common"
import { t } from "@app/locale"
import { generateSiteLabel } from "@util/site"
import { getSeriesPalette } from "@app/util/echarts"

use([PieChart, TitleComponent, TooltipComponent, SVGRenderer])

export const TOP_NUM = 6, DAY_NUM = 30

type EcOption = ComposeOption<
    | PieSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
>

export type BizOption = {
    name: string
    value: number
    // Extensive info
    host: string
    alias?: string
}

function generateOption(data: BizOption[]): EcOption {
    const textColor = getPrimaryTextColor()
    return {
        title: {
            ...BASE_TITLE_OPTION,
            text: t(msg => msg.dashboard.topK.title, { k: TOP_NUM, day: DAY_NUM }),
            textStyle: {
                color: textColor,
                fontSize: '14px',
            }
        },
        tooltip: {
            show: true,
            borderWidth: 0,
            formatter(params: any) {
                const visit = params.data?.value || 0
                const host = params.data?.host || ''
                const alias = params.data?.alias || ''
                const hostLabel = generateSiteLabel(host, alias)
                return `${hostLabel}<br/><b>${visit}</b>`
            }
        },
        series: {
            top: '20%',
            height: '80%',
            type: 'pie',
            radius: [20, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            color: getSeriesPalette(),
            itemStyle: {
                borderRadius: 7
            },
            label: { color: textColor },
            data: data
        }
    }
}

class Wrapper extends EchartsWrapper<BizOption[], EcOption> {
    generateOption = generateOption
}

export default Wrapper
