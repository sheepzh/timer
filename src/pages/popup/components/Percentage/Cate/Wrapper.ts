import { EchartsWrapper } from "@hooks/useEcharts"
import { type PopupResult } from "@popup/common"
import { t } from "@popup/locale"
import cateService from "@service/cate-service"
import { CATE_MERGE_PLACEHOLDER_ID } from "@service/stat-service/common"
import { groupBy } from "@util/array"
import { getInfoColor, getPrimaryTextColor } from "@util/style"
import { PieChart, type PieSeriesOption } from "echarts/charts"
import {
    LegendComponent,
    type LegendComponentOption,
    TitleComponent,
    type TitleComponentOption,
    ToolboxComponent,
    type ToolboxComponentOption,
    TooltipComponent,
    type TooltipComponentOption,
} from "echarts/components"
import { type ComposeOption, use } from "echarts/core"
import { SVGRenderer } from "echarts/renderers"
import { generateTextOption } from "../common"

type EcOption = ComposeOption<
    | PieSeriesOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | LegendComponentOption
>

use([SVGRenderer, PieChart, LegendComponent, TitleComponent, TooltipComponent, ToolboxComponent])

type CateSeriesItemOption = PieSeriesOption['data'][0] & {
    cateKey: number
}

type SelectChangeEvent = {
    type: 'selectchanged'
    fromAction: 'select' | 'unselect'
    fromActionPayload: {
        seriesIndex: number
        dataIndexInside: number
    }
}

export default class SiteWrapper extends EchartsWrapper<PopupResult, EcOption> {
    private resultCache: PopupResult
    private selectedCache: number = -1

    init(container: HTMLDivElement): void {
        super.init(container)

        this.instance.on('selectchanged', (ev: SelectChangeEvent) => {
            const { type, fromAction, fromActionPayload } = ev || {}
            const { seriesIndex, dataIndexInside } = fromActionPayload || {}
            if (type !== 'selectchanged' || seriesIndex !== 0) return

            if (fromAction === 'unselect') {
                this.handleSelect(undefined)
                return
            }

            const option = this.instance.getOption() as EcOption
            const selectedItem = (option.series?.[0] as PieSeriesOption)?.data?.[dataIndexInside] as CateSeriesItemOption
            const selectedId = selectedItem?.cateKey
            selectedId && this.handleSelect(selectedId)
        })
    }

    protected async generateOption(result: PopupResult): Promise<EcOption> {
        if (!result) return

        // Let not set to the end
        const rows = result.rows?.sort((_, a) => a.cateKey === CATE_MERGE_PLACEHOLDER_ID ? -1 : 0)
        this.resultCache = { ...result, rows }

        return this.generateInner()
    }

    private async generateInner(): Promise<EcOption> {
        const result = this.resultCache

        if (!result) return {}

        const { rows, query } = result
        const { type } = query || {}
        const selected = rows?.filter(r => r?.cateKey === this.selectedCache)?.[0]

        const textColor = getPrimaryTextColor()
        const inactiveColor = getInfoColor()

        const cates = await cateService.listAll()
        const cateNameMap = groupBy(cates, c => c.id, l => l?.[0]?.name)
        cateNameMap[CATE_MERGE_PLACEHOLDER_ID] = t(msg => msg.shared.cate.notSet)

        const series: PieSeriesOption[] = [{
            type: "pie",
            center: selected ? ['15%', '28%'] : ['50%', '52%'],
            radius: selected ? '30%' : '55%',
            selectedMode: 'single',
            startAngle: 180,
            data: rows.map(row => ({
                value: row[type],
                cateKey: row.cateKey,
                selected: row.cateKey === selected?.cateKey,
                name: cateNameMap[row.cateKey],
            } satisfies CateSeriesItemOption)),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
            minShowLabelAngle: selected ? 10 : 0,
            label: {
                color: textColor,
                position: selected ? 'inner' : 'outer',
            },
            labelLine: {
                show: !selected,
            }
        }]
        if (selected) {
            const mergedRows = (selected?.mergedRows || []).sort((a, b) => (b[type] ?? 0) - (a[type] ?? 0))
            series.push({
                type: "pie",
                center: ['63%', '55%'],
                radius: '55%',
                startAngle: 180,
                data: mergedRows.map(row => ({
                    value: row[type],
                    cateId: row.cateKey,
                    siteKey: row.siteKey,
                    name: row.alias ?? row.siteKey?.host,
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
                minShowLabelAngle: 10,
                label: {
                    color: textColor,
                    position: 'outer',
                },
            })
        }

        const option: EcOption = {
            title: generateTextOption(result),
            legend: {
                show: !selected,
                type: 'scroll',
                orient: 'vertical',
                left: 15,
                top: 50,
                bottom: 50,
                textStyle: { color: textColor },
                pageTextStyle: { color: textColor },
                inactiveColor,
                data: rows.map(({ cateKey }) => ({ name: cateNameMap[cateKey], cateKey })),
            },
            series,
        }
        return option
    }

    private async handleSelect(selectedId: number) {
        this.selectedCache = selectedId
        const option = await this.generateInner()
        this.instance.setOption(option, true, true)
    }
}