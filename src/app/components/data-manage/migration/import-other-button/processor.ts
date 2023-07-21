import StatDatabase from "@db/stat-database"
import { isNotZeroResult } from "@util/stat"

const statDatabase: StatDatabase = new StatDatabase(chrome.storage.local)

export type OtherExtension = "web_activity_time_tracker"

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

/**
 * Parse the content to rows
 * 
 * @param type extension type
 * @param file selected file
 * @returns row data
 */
export async function parseFile(ext: OtherExtension, file: File): Promise<ImportedData> {
    const text = await file.text()
    if (ext === 'web_activity_time_tracker') {
        const lines = text.split('\n').map(line => line.trim()).filter(line => !!line).splice(1)
        const rows: ImportedRow[] = lines.map(line => {
            const [host, date, seconds] = line.split(',').map(cell => cell.trim())
            const [year, month, day] = date.split('/')
            const realDate = `${year}${month.length == 2 ? month : '0' + month}${day.length == 2 ? day : '0' + day}`
            return { host, date: realDate, focus: parseInt(seconds) * 1000 }
        })
        await doIfExist(rows, (row, exist) => row.exist = exist)
        return { rows, focus: true }
    } else {
        return { rows: [] }
    }
}

async function doIfExist<T extends timer.stat.RowKey>(items: T[], processor: (item: T, existVal: timer.stat.Result) => any): Promise<void> {
    await Promise.all(items.map(async item => {
        const { host, date } = item
        const exist = await statDatabase.get(host, date)
        isNotZeroResult(exist) && processor(item, exist)
    }))
}

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