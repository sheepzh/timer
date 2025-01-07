import { EchartsWrapper } from "@hooks/useEcharts"
import { t } from "@popup/locale"
import cateService from "@service/cate-service"
import { CATE_MERGE_PLACEHOLDER_ID } from "@service/stat-service/common"
import { groupBy } from "@util/array"
import { getInfoColor, getPrimaryTextColor } from "@util/style"
import { type PieSeriesOption } from "echarts/charts"
import {
    type LegendComponentOption,
    type TitleComponentOption,
    type ToolboxComponentOption,
    type TooltipComponentOption,
} from "echarts/components"
import { type ComposeOption, type ECElementEvent } from "echarts/core"
import {
    formatTooltip, generateSiteSeriesOption, generateTitleOption, generateToolboxOption, handleClick,
    type PieSeriesItemOption,
} from "../chart"
import { type PercentageResult } from "../query"

type EcOption = ComposeOption<
    | PieSeriesOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | LegendComponentOption
>

type SelectChangeEvent = {
    type: 'selectchanged'
    fromAction: 'select' | 'unselect'
    fromActionPayload: {
        seriesIndex: number
        dataIndexInside: number
    }
}

export default class SiteWrapper extends EchartsWrapper<PercentageResult, EcOption> {
    private resultCache: PercentageResult
    private selectedCache: number

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
            const selectedItem = (option.series?.[0] as PieSeriesOption)?.data?.[dataIndexInside] as PieSeriesItemOption
            const selectedId = selectedItem?.cateKey
            selectedId && this.handleSelect(selectedId)
        })

        this.instance.on('click', (ev: ECElementEvent) => {
            const { type: evType, componentType, seriesIndex, data } = ev || {}
            if (evType !== 'click' || componentType !== 'series' || seriesIndex !== 1) {
                return
            }

            const { query: { type } = {}, date } = this.resultCache || {}
            handleClick(data as PieSeriesItemOption, date, type)
        })
    }

    protected async generateOption(result: PercentageResult): Promise<EcOption> {
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
        const selected = this.selectedCache && rows?.filter(r => r?.cateKey === this.selectedCache)?.[0]

        const textColor = getPrimaryTextColor()
        const inactiveColor = getInfoColor()

        const cates = await cateService.listAll()
        const cateNameMap = groupBy(cates, c => c.id, l => l?.[0]?.name)
        cateNameMap[CATE_MERGE_PLACEHOLDER_ID] = t(msg => msg.shared.cate.notSet)

        let legend: LegendComponentOption = {
            type: 'scroll',
            orient: 'vertical',
            left: '5%',
            top: 50,
            bottom: 50,
            textStyle: { color: textColor },
            pageTextStyle: { color: textColor },
            inactiveColor,
            data: rows.map(({ cateKey }) => ({ name: cateNameMap[cateKey] ?? `${cateKey}`, cateKey })),
        }

        const series: PieSeriesOption[] = [{
            type: "pie",
            center: selected ? ['15%', '28%'] : ['58%', '56%'],
            radius: selected ? '30%' : '55%',
            selectedMode: 'single',
            startAngle: 180,
            data: rows.map(row => ({
                value: row[type],
                cateKey: row.cateKey,
                selected: row.cateKey === selected?.cateKey,
                name: cateNameMap[row.cateKey],
            } satisfies PieSeriesItemOption)),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
            minShowLabelAngle: selected ? 35 : 0,
            label: {
                color: textColor,
                position: selected ? 'inner' : 'outer',
                fontSize: selected ? 10 : undefined,
            },
        }]
        if (selected) {
            const mergedRows = (selected?.mergedRows || []).sort((a, b) => (b[type] ?? 0) - (a[type] ?? 0))

            const siteSeries = generateSiteSeriesOption(mergedRows, result, {
                center: ['60%', '58%'],
                radius: '55%',
                minShowLabelAngle: 3,
                selectedMode: false,
            })

            legend = {
                type: 'scroll',
                orient: 'vertical',
                left: '5%',
                top: '48%',
                bottom: 50,
                textStyle: { color: textColor },
                pageTextStyle: { color: textColor },
                inactiveColor,
                data: siteSeries.data?.map(({ name }: { name: string }) => ({ name })),
            }
            series.push(siteSeries)
        }

        const option: EcOption = {
            title: generateTitleOption(result),
            legend,
            tooltip: {
                show: true,
                formatter: (params: any) => formatTooltip(result, params),
            },
            series,
            toolbox: generateToolboxOption(),
        }
        return option
    }

    private async handleSelect(selectedId: number) {
        this.selectedCache = selectedId
        const option = await this.generateInner()
        this.instance.setOption(option, true, true)
    }
}