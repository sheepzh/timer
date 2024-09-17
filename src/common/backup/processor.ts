/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BackupDatabase from "@db/backup-database"
import metaService from "@service/meta-service"
import optionService from "@service/option-service"
import statService from "@service/stat-service"
import { judgeVirtualFast } from "@util/pattern"
import { formatTimeYMD, getBirthday } from "@util/time"
import GistCoordinator from "./gist/coordinator"
import ObsidianCoordinator from "./obsidian/coordinator"
import QuantifiedResumeCoordinator from "./quantified-resume/coordinator"
import WebDAVCoordinator from "./web-dav/coordinator"

const storage = chrome.storage.local
const syncDb = new BackupDatabase(storage)

export type AuthCheckResult = {
    type: timer.backup.Type
    context: CoordinatorContextWrapper<unknown>
    coordinator: timer.backup.Coordinator<unknown>
    errorMsg?: string
}

function prepareAuth(option: timer.option.BackupOption): timer.backup.Auth {
    const type = option?.backupType || 'none'
    const token = option?.backupAuths?.[type]
    const login = option.backupLogin?.[type]
    return { token, login }
}

class CoordinatorContextWrapper<Cache> implements timer.backup.CoordinatorContext<Cache> {
    auth: timer.backup.Auth
    ext?: timer.backup.TypeExt
    cache: Cache
    type: timer.backup.Type
    cid: string
    cname: string

    constructor(cid: string, option: timer.option.BackupOption) {
        const { backupType, backupExts, clientName } = option || {}
        this.type = backupType || 'none'
        this.ext = backupExts?.[this.type]
        this.auth = prepareAuth(option)

        this.cid = cid
        this.cname = clientName
    }

    async init(): Promise<timer.backup.CoordinatorContext<Cache>> {
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
    context: timer.backup.CoordinatorContext<unknown>,
    coordinator: timer.backup.Coordinator<unknown>,
    client: timer.backup.Client
): Promise<timer.backup.Snapshot> {
    // 1. select rows
    let start = getBirthday()
    let end = new Date()
    const rows = await statService.select({ date: [start, end] })
    const allDates = rows.map(r => r.date).sort((a, b) => a == b ? 0 : a > b ? 1 : -1)
    client.maxDate = allDates[allDates.length - 1]
    client.minDate = allDates[0]
    // 2. upload
    await coordinator.upload(context, rows)
    return {
        ts: end.getTime(),
        date: formatTimeYMD(end),
    }
}

function filterClient(c: timer.backup.Client, excludeLocal: boolean, localClientId: string, start: string, end: string) {
    // Exclude local client
    if (excludeLocal && c.id === localClientId) return false
    // Judge range
    if (start && c.maxDate && c.maxDate < start) return false
    if (end && c.minDate && c.minDate > end) return false
    return true
}

export type RemoteQueryParam = {
    start: Date
    end: Date
    specCid?: string
    excludeLocal?: boolean
}

class Processor {
    coordinators: {
        [type in timer.backup.Type]: timer.backup.Coordinator<unknown>
    }

    constructor() {
        this.coordinators = {
            none: undefined,
            gist: new GistCoordinator(),
            obsidian_local_rest_api: new ObsidianCoordinator(),
            web_dav: new WebDAVCoordinator(),
            quantified_resume: new QuantifiedResumeCoordinator(),
        }
    }

    async syncData(): Promise<Result<number>> {
        const { type, context, coordinator, errorMsg } = await this.checkAuth()
        if (errorMsg) return error(errorMsg)
        let cid = context.cid
        const client: timer.backup.Client = {
            id: cid,
            name: context.cname,
            minDate: undefined,
            maxDate: undefined
        }
        try {
            let snapshot: timer.backup.Snapshot = await syncFull(context, coordinator, client)
            await syncDb.updateSnapshot(type, snapshot)
            const clients: timer.backup.Client[] = (await coordinator.listAllClients(context)).filter(a => a.id !== cid) || []
            clients.push(client)
            await coordinator.updateClients(context, clients)
            // Update time
            const now = Date.now()
            metaService.updateBackUpTime(type, now)
            return success(now)
        } catch (e) {
            console.error("Error to sync data", e)
            const msg = (e as Error)?.message || e
            return error(msg)
        }
    }

    async listClients(): Promise<Result<timer.backup.Client[]>> {
        const { context, coordinator, errorMsg } = await this.checkAuth()
        if (errorMsg) return error(errorMsg)
        await context.init()
        const clients = await coordinator.listAllClients(context)
        return success(clients)
    }

    async checkAuth(): Promise<AuthCheckResult> {
        const option = (await optionService.getAllOption()) as timer.option.BackupOption
        const type = option.backupType
        const cid = await lazyGetCid()
        const context = new CoordinatorContextWrapper<unknown>(cid, option)

        const coordinator: timer.backup.Coordinator<unknown> = this.coordinators?.[context.type]
        if (!coordinator) {
            // no coordinator, do nothing
            return { type, context, coordinator, errorMsg: "Invalid type" }
        }
        let errorMsg: string
        try {
            errorMsg = await coordinator.testAuth(context.auth, context.ext)
        } catch (e) {
            errorMsg = (e as Error)?.message || 'Unknown error'
        }
        return { type, context, coordinator, errorMsg }
    }

    async query(param: RemoteQueryParam): Promise<timer.stat.Row[]> {
        const { coordinator, context, errorMsg } = await this.checkAuth()
        if (errorMsg || !coordinator) {
            return []
        }

        const { start = getBirthday(), end, specCid, excludeLocal } = param
        // 1. init context
        await context.init()
        // 2. query all clients, and filter them
        let startStr = start ? formatTimeYMD(start) : undefined
        let endStr = end ? formatTimeYMD(end) : undefined
        const allClients = (await coordinator.listAllClients(context))
            .filter(c => filterClient(c, excludeLocal, context.cid, startStr, endStr))
            .filter(c => !specCid || c.id === specCid)
        // 3. iterate clients
        const result: timer.stat.Row[] = []
        await Promise.all(
            allClients.map(async client => {
                const { id, name } = client
                const rows = await coordinator.download(context, start, end, id)
                rows.forEach(row => result.push({
                    ...row,
                    cid: id,
                    cname: name,
                    mergedHosts: [],
                    virtual: judgeVirtualFast(row.host),
                }))
            })
        )
        console.log(`Queried ${result.length} remote items`)
        return result
    }

    async clear(cid: string): Promise<Result<void>> {
        const { context, coordinator, errorMsg } = await this.checkAuth()
        if (errorMsg) return error(errorMsg)
        await context.init()
        // 1. Find the client
        const allClients = await coordinator.listAllClients(context)
        const client = allClients?.filter(c => c?.id === cid)?.[0]
        if (!client) {
            return
        }
        // 2. clear
        await coordinator.clear(context, client)
        // 3. remove client
        const newClients = allClients.filter(c => c?.id !== cid)
        await coordinator.updateClients(context, newClients)

        return success()
    }
}

export default new Processor()