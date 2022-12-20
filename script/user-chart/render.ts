import {
    createGist,
    FileForm,
    findTarget,
    getJsonFileContent,
    Gist,
    GistForm,
    updateGist
} from "@api/gist"
import { UserCount } from "./add"
import { Argv, Browser } from "./argv"
import { filenameOf, getExistGist } from "./common"
import { EChartsType, init } from "echarts"

const ALL_BROWSERS: Browser[] = ['firefox', 'edge', 'chrome']

type OriginData = {
    [browser in Browser]: UserCount
}

type ChartData = {
    xAixs: string[]
    yAixses: {
        [browser in Browser]: number[]
    }
}

export async function render(argv: Argv): Promise<void> {
    const token = argv.gistToken
    // 1. get all data
    const originData: OriginData = await getOriginData(token)
    // 2. pre-process data
    const chartData = preProcess(originData)
    // 3. render csv
    const svg = render2Svg(chartData)
    // 4. upload
    await upload2Gist(token, svg)
    process.exit()
}

function preProcess(originData: OriginData): ChartData {
    // 1. sort datess
    const dateSet = new Set<string>()
    Object.values(originData).forEach(ud => Object.keys(ud).forEach(date => dateSet.add(date)))
    let allDates = Array.from(dateSet).sort()

    // 2. smooth the count
    const ctx: { [browser in Browser]: SmoothContext } = {
        chrome: new SmoothContext(),
        firefox: new SmoothContext(),
        edge: new SmoothContext(),
    }

    allDates.forEach(
        date => ALL_BROWSERS.forEach(b => ctx[b].process(originData[b][date]))
    )
    const result = {
        xAixs: allDates,
        yAixses: {
            chrome: ctx.chrome.end(),
            firefox: ctx.firefox.end(),
            edge: ctx.edge.end(),
        }
    }

    // 3. zoom
    const reduction = Math.floor(Object.keys(allDates).length / 150)
    result.xAixs = zoom(result.xAixs, reduction)
    ALL_BROWSERS.forEach(b => result.yAixses[b] = zoom(result.yAixses[b], reduction))
    return result
}

class SmoothContext {
    lastVal: number
    step: number
    data: number[]

    constructor() {
        this.lastVal = 0
        this.step = 0
        this.data = []
    }

    /**
     * Process value
     */
    process(newVal: number | undefined) {
        if (newVal) {
            this.smooth(newVal)
        } else {
            this.increaseStep()
        }
    }

    smooth(currentValue: number): void {
        if (this.step < 0) {
            return
        }
        const unitVal = (currentValue - this.lastVal) / (this.step + 1)
        Object.keys(Array.from(new Array(this.step)))
            .map(key => parseInt(key))
            .map(i => Math.floor(unitVal * (i + 1) + this.lastVal))
            .forEach(smoothedVal => this.data.push(smoothedVal))
        this.data.push(currentValue)
        // Reset
        this.lastVal = currentValue
        this.step = 0
    }

    increaseStep(): void {
        this.step += 1
    }

    end(): number[] {
        Object.keys(Array.from(new Array(this.step)))
            .forEach(() => this.data.push(this.lastVal))
        return this.data
    }
}

function zoom<T>(data: T[], reduction: number): T[] {
    let i = 0
    const newData = []
    while (i < data.length) {
        newData.push(data[i])
        i += reduction
    }
    return newData
}

function render2Svg(chartData: ChartData): string {
    const { xAixs, yAixses } = chartData
    const chart: EChartsType = init(null, null, {
        renderer: 'svg',
        ssr: true,
        width: 960,
        height: 640
    })
    chart.setOption({
        title: {
            text: 'Total Active User Count',
            subtext: `${xAixs[0]} to ${xAixs[xAixs.length - 1]}`
        },
        legend: { data: ALL_BROWSERS },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: xAixs
        }],
        yAxis: [
            { type: 'value' }
        ],
        series: ALL_BROWSERS.map(b => ({
            name: b,
            type: 'line',
            stack: 'Total',
            // Fill the area
            areaStyle: {},
            data: yAixses[b]
        }))
    })
    return chart.renderToSVGString()
}

const USER_COUNT_GIST_DESC = "User count of timer, auto-generated"
const USER_COUNT_SVG_FILE_NAME = "user_count.svg"

async function getOriginData(token: string): Promise<OriginData> {
    const [firefox, edge, chrome]: UserCount[] = await Promise.all(
        ALL_BROWSERS.map(b => getDataFromGist(token, b))
    )
    return { chrome, firefox, edge }
}

/**
 * Get the data from gist
 */
async function getDataFromGist(token: string, browser: Browser): Promise<UserCount> {
    const gist: Gist = await getExistGist(token, browser)
    const file = gist?.files[filenameOf(browser)]
    return file ? getJsonFileContent<UserCount>(file) : {}
}

/**
 * Upload svg string to gist
 */
async function upload2Gist(token: string, svg: string) {
    const files: Record<string, FileForm> = {}
    files[USER_COUNT_SVG_FILE_NAME] = {
        filename: USER_COUNT_SVG_FILE_NAME,
        content: svg
    }
    const form: GistForm = {
        public: true,
        description: USER_COUNT_GIST_DESC,
        files
    }
    const gist = await findTarget(token, gist => gist.description === USER_COUNT_GIST_DESC)
    if (gist) {
        await updateGist(token, gist.id, form)
        console.log('Updated gist')
    } else {
        await createGist(token, form)
        console.log('Created new gist')
    }
}
