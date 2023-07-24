import StatDatabase from "@db/stat-database"
import { AUTHOR_EMAIL } from "@src/package"
import { isNotZeroResult } from "@util/stat"

const statDatabase: StatDatabase = new StatDatabase(chrome.storage.local)

export type OtherExtension = "webtime_tracker" | "web_activity_time_tracker"

export type ActionType = 'overwrite' | 'accumulate'

export type ImportedRow = Required<timer.stat.RowKey> & Partial<timer.stat.Result> & {
    exist?: timer.stat.Result
}

export type ImportedData = {
    // Whether there is data for this dimension
    [dimension in timer.stat.Dimension]?: boolean
} & {
    rows: ImportedRow[]
}

const throwError = () => { throw new Error("Failed to parse, please check your file or contact the author via " + AUTHOR_EMAIL) }

/**
 * Parse the content to rows
 * 
 * @param type extension type
 * @param file selected file
 * @returns row data
 */
export async function parseFile(ext: OtherExtension, file: File): Promise<ImportedData> {
    let rows: ImportedRow[] = []
    let focus = false
    let time = false
    if (ext === 'web_activity_time_tracker') {
        rows = await parseWebActivityTimeTracker(file)
        focus = true
    } else if (ext === 'webtime_tracker') {
        rows = await parseWebtimeTracker(file)
        focus = true
    }
    await doIfExist(rows, (row, exist) => row.exist = exist)
    return { rows, focus, time }
}

async function doIfExist<T extends timer.stat.RowKey>(items: T[], processor: (item: T, existVal: timer.stat.Result) => any): Promise<void> {
    await Promise.all(items.map(async item => {
        const { host, date } = item
        const exist = await statDatabase.get(host, date)
        isNotZeroResult(exist) && processor(item, exist)
    }))
}

async function parseWebActivityTimeTracker(file: File): Promise<ImportedRow[]> {
    const text = await file.text()
    const lines = text.split('\n').map(line => line.trim()).filter(line => !!line).splice(1)
    const rows: ImportedRow[] = lines.map(line => {
        const [host, date, seconds] = line.split(',').map(cell => cell.trim())
        !host || !date || (!seconds && seconds !== '0') && throwError()
        const [year, month, day] = date.split('/')
        !year || !month || !day && throwError()
        const realDate = `${year}${month.length == 2 ? month : '0' + month}${day.length == 2 ? day : '0' + day}`
        return { host, date: realDate, focus: parseInt(seconds) * 1000 }
    })
    return rows
}

type WebtimeTrackerBackup = {
    content: {
        domains: {
            [domain: string]: {
                name: string
                days: {
                    // date format: 2023-07-22
                    [date: string]: { seconds: number }
                }
            }
        }
    }
}

const WEBTIME_TRACKER_DATE_REG = /(\d{2})-(\d{2})-\d{2}/
const cvtWebtimeTrackerDate = (date: string): string => WEBTIME_TRACKER_DATE_REG.test(date) ? date.split('-').join('') : undefined

async function parseWebtimeTracker(file: File): Promise<ImportedRow[]> {
    const text = await file.text()
    if (isJsonFile(file)) {
        // JSON file by backup
        const data = JSON.parse(text) as WebtimeTrackerBackup
        const domains = data?.content?.domains || {}
        const rows: ImportedRow[] = Object.entries(domains)
            .flatMap(
                ([host, value]) => Object.entries(value?.days || {})
                    .map(([date, item]) => [host, cvtWebtimeTrackerDate(date), item?.seconds] as [string, string, number])
            )
            .filter(([host, date, seconds]) => host && date && seconds)
            .map(([host, date, seconds]) => ({
                host,
                date,
                focus: seconds * 1000
            } as ImportedRow))
        console.log(rows)
        return rows
    } else if (isCsvFile(file)) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => !!line)
        const colHeaders = lines[0].split(',')
        const rows: ImportedRow[] = []
        lines.slice(1).forEach(line => {
            const cells = line.split(',')
            const host = cells[0]
            if (!host) return
            for (let i = 1; i < colHeaders?.length; i++) {
                const seconds = Number.parseInt(cells[i])
                const date = cvtWebtimeTrackerDate(colHeaders[i])
                seconds && date && rows.push({ host, date, focus: seconds * 1000 })
            }
        })
        return rows
    }
    throw new Error("Invalid file format")
}

const isJsonFile = (file: File): boolean => file?.type?.startsWith('application/json')

const isCsvFile = (file: File): boolean => file?.type?.startsWith('text/csv')

/**
 * Import data
 */
export async function processImport(data: ImportedData, action: ActionType): Promise<void> {
    if (action === 'overwrite') {
        return processOverwrite(data)
    } else {
        return processAcc(data)
    }
}

function processOverwrite(data: ImportedData): Promise<any> {
    const { rows, focus, time } = data
    return Promise.all(rows.map(async row => {
        const { host, date } = row
        const exist = await statDatabase.get(host, date)
        focus && (exist.focus = row.focus || 0)
        time && (exist.time = row.time || 0)
        await statDatabase.forceUpdate({ host, date, ...exist })
    }))
}

function processAcc(data: ImportedData): Promise<any> {
    const { rows } = data
    return Promise.all(rows.map(async row => {
        const { host, date, focus = 0, time = 0 } = row
        await statDatabase.accumulate(host, date, { focus, time })
    }))
}