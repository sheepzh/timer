/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BackupDatabase from "@db/backup-database"
import metaService from "@service/meta-service"
import optionService from "@service/option-service"
import timerService from "@service/timer-service"
import MonthIterator from "@util/month-iterator"
import { formatTime, getBirthday } from "@util/time"
import GistCoordinator from "./gist/coordinator"

const storage = chrome.storage.local
const syncDb = new BackupDatabase(storage)

class CoordinatorContextWrapper<Cache> implements CoordinatorContext<Cache>{
    auth: string
    cache: Cache
    type: timer.backup.Type
    cid: string

    constructor(cid: string, auth: string, type: timer.backup.Type) {
        this.cid = cid
        this.auth = auth
        this.type = type
    }

    async init(): Promise<CoordinatorContext<Cache>> {
        this.cache = await syncDb.getCache(this.type) as Cache
        return this
    }

    handleCacheChanged(): Promise<void> {
        return syncDb.updateCache(this.type, this.cache)
    }
}

/**
 * Declare type of NavigatorUAData
 */
type NavigatorUAData = {
    brands?: {
        brand?: string
        version?: string
    }[]
    platform?: string
}

type Result<T> = {
    success: boolean
    errorMsg?: string
    data?: T
}

function error<T>(msg: string): Result<T> {
    return { success: false, errorMsg: msg, }
}

function success<T>(data?: T): Result<T> {
    return { success: true, data }
}

function generateCid() {
    const uaData = (navigator as any)?.userAgentData as NavigatorUAData
    let prefix = 'unknown'
    if (uaData) {
        const brand: string = uaData.brands
            ?.map(e => e.brand)
            ?.filter(brand => brand !== "Chromium" && !brand.includes("Not"))
            ?.[0]
            ?.replace(' ', '-')
            || undefined
        const platform: string = uaData.platform
        brand && platform && (prefix = `${platform.toLowerCase()}-${brand.toLowerCase()}`)
    }
    return prefix + '-' + new Date().getTime()
}

/**
 * Get client id or generate it lazily
 */
async function lazyGetCid(): Promise<string> {
    let cid = await metaService.getCid()
    if (!cid) {
        cid = generateCid()
        await metaService.updateCid(cid)
    }
    return cid
}

async function syncFull(
    context: CoordinatorContext<unknown>,
    coordinator: Coordinator<unknown>,
    client: Client
): Promise<timer.backup.Snapshot> {
    // 1. select rows
    let start = getBirthday()
    let end = new Date()
    const rows = await timerService.select({ date: [start, end] })
    const allDates = rows.map(r => r.date).sort((a, b) => a == b ? 0 : a > b ? 1 : -1)
    client.maxDate = allDates[allDates.length - 1]
    client.minDate = allDates[0]
    // 2. upload
    try {
        await coordinator.upload(context, rows)
    } catch (error) {
        console.log(error)
    }
    return {
        ts: end.getTime(),
        date: formatTime(end, '{y}{m}{d}')
    }
}

function filterClient(c: Client, localClientId: string, start: string, end: string) {
    // Excluse local client
    if (c.id === localClientId) return false
    // Judge range
    if (start && c.maxDate && c.maxDate < start) return false
    if (end && c.minDate && c.minDate > end) return false
    return true
}

function filterDate(row: timer.stat.RowBase, start: string, end: string) {
    const { date } = row
    if (!date) return false
    if (start && date < start) return false
    if (end && date > end) return false
    return true
}

class Processor {
    coordinators: {
        [type in timer.backup.Type]: Coordinator<unknown>
    }

    constructor() {
        this.coordinators = {
            none: undefined,
            gist: new GistCoordinator()
        }
    }

    async syncData(): Promise<Result<void>> {
        const option = (await optionService.getAllOption()) as timer.option.BackupOption
        const auth = option?.backupAuths?.[option.backupType || 'none']

        const type = option?.backupType
        const coordinator: Coordinator<unknown> = type && this.coordinators[type]
        if (!coordinator) {
            // no coordinator, do nothing
            return error("Invalid type")
        }

        const errorMsg = await this.test(type, auth)
        if (errorMsg) return error(errorMsg)

        const cid = await lazyGetCid()
        const context: CoordinatorContext<unknown> = await new CoordinatorContextWrapper<unknown>(cid, auth, type).init()
        const client: Client = {
            id: cid,
            name: option.clientName,
            minDate: undefined,
            maxDate: undefined
        }
        let snapshot: timer.backup.Snapshot = await syncFull(context, coordinator, client)
        await syncDb.updateSnapshot(type, snapshot)
        const clients: Client[] = (await coordinator.listAllClients(context)).filter(a => a.id !== cid) || []
        clients.push(client)
        await coordinator.updateClients(context, clients)
        return success()
    }

    async query(type: timer.backup.Type, auth: string, start: Date, end: Date): Promise<timer.stat.RemoteRow[]> {
        const coordinator: Coordinator<unknown> = this.coordinators?.[type]
        if (!coordinator) return []
        let cid = await metaService.getCid()
        // 1. init context
        const context: CoordinatorContext<unknown> = await new CoordinatorContextWrapper<unknown>(cid, auth, type).init()
        // 2. query all clients, and filter them
        let startStr = start ? formatTime(start, '{y}{m}{d}') : undefined
        let endStr = end ? formatTime(end, '{y}{m}{d}') : undefined
        const allClients = (await coordinator.listAllClients(context))
            .filter(c => filterClient(c, cid, startStr, endStr))
        // 3. iterate month and clients
        const result: timer.stat.RemoteRow[] = []
        const allYearMonth = new MonthIterator(start, end || new Date()).toArray()
        await Promise.all(allClients.map(async client => {
            const { id, name } = client
            await Promise.all(allYearMonth.map(async ym => {
                (await coordinator.download(context, ym, id))
                    .filter(row => filterDate(row, startStr, endStr))
                    .forEach(row => result.push({
                        ...row,
                        clientName: name
                    }))
            }))
        }))
        console.log(`Queried ${result.length} remote items`)
        return result
    }

    async test(type: timer.backup.Type, auth: string): Promise<string> {
        const coordinator: Coordinator<unknown> = this.coordinators?.[type]
        if (!coordinator) {
            return 'Invalid type'
        }
        return coordinator.testAuth(auth)
    }
}

export default new Processor()