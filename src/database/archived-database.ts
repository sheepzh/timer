import { log } from '../common/logger'
import WastePerDay from '../entity/dao/waste-per-day'
import SiteInfo from '../entity/dto/site-info'
import { ARCHIVED_PREFIX } from './constant'

/**
 * Database of archived site
 *  
 * @since 0.0.9
 */
class ArchivedDatabase {
    private localStorage: chrome.storage.StorageArea

    constructor(storage: chrome.storage.StorageArea) {
        this.localStorage = storage
    }

    refresh(): Promise<{}> {
        return new Promise(resolve =>
            this.localStorage.get(items => {
                const result = Object.entries(items)
                    .filter(([key]) => key.startsWith(ARCHIVED_PREFIX))
                    .reduce((obj, [key, val]) => {
                        obj[key.substr(ARCHIVED_PREFIX.length)] = val
                        return obj
                    }, {})
                log('All archived', result)
                resolve(result)
            })
        )
    }

    private generateKey(row: SiteInfo): string {
        return ARCHIVED_PREFIX + row.host
    }

    /**
     * Archive by key
     *  
     * @param rows     site rows, the host and date mustn't be null
     */
    async updateArchived(rows: SiteInfo[]): Promise<void> {
        const domainSet: Set<string> = new Set()
        rows = rows.filter(({ date, host }) => !!host && !!date)
        rows.forEach(({ host }) => domainSet.add(host))
        const archived = await this.selectArchived(domainSet)
        const archiveMap = {}
        archived.forEach(a => archiveMap[a.host] = a)
        rows.forEach(row => {
            const { host, focus, total, time } = row
            let archive = archiveMap[host]
            if (!archive) {
                archive = new SiteInfo(host)
                archiveMap[host] = archive
            }
            archive.focus += focus || 0
            archive.total += total || 0
            archive.time += time || 0
        })
        const archivedValues = Object.values(archiveMap) as SiteInfo[]
        return this.rewrite(archivedValues)
    }

    private async rewrite(toWrite: SiteInfo[]): Promise<void> {
        const promises = toWrite.map(tw => {
            const object = {}
            const { total, focus, time } = tw
            object[this.generateKey(tw)] = { total, focus, time }
            return new Promise<void>(resolve => this.localStorage.set(object, resolve))
        })
        await Promise.all(promises)
        return Promise.resolve()
    }

    /**
     * Select the archived data
     * 
     * @param domains  the domains which the key belongs to
     */
    async selectArchived(domains: Set<string>): Promise<SiteInfo[]> {
        const items = await this.refresh()
        const result: SiteInfo[] = Object.entries(items)
            .filter(([key]) => domains.has(key))
            .map(([host, waste]) => {
                const { focus, total, time } = waste as WastePerDay
                return { focus, total, time, host, date: '', mergedHosts: [] }
            })
        return await Promise.resolve(result)
    }
}

export default ArchivedDatabase