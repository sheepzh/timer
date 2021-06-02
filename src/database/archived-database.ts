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
    private localStorage = chrome.storage.local

    refresh(): Promise<{}> {
        return new Promise(resolve =>
            this.localStorage.get(result => {
                const items = {}
                for (let key in result) {
                    if (key.startsWith(ARCHIVED_PREFIX)) {
                        items[key.substr(ARCHIVED_PREFIX.length)] = result[key]
                    }
                }
                log('All archived', items)
                resolve(items)
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
            const { host: host_2, focus, total, time } = row
            let archive = archiveMap[host_2]
            if (!archive) {
                archive = new SiteInfo(host_2)
                archiveMap[host_2] = archive
            }
            archive.focus += focus || 0
            archive.total += total || 0
            archive.time += time || 0
        })
        const archivedValues = Object.values(archiveMap) as SiteInfo[]
        return await this.rewrite(archivedValues)
    }

    private async rewrite(toWrite: SiteInfo[]): Promise<void> {
        const promises: Promise<void>[] = toWrite.map(tw => {
            const object = {}
            const { total, focus, time } = tw
            object[this.generateKey(tw)] = { total, focus, time }
            return new Promise(resolve => this.localStorage.set(object, resolve))
        })
        await Promise.all(promises)
        return await Promise.resolve()
    }

    /**
     * Select the archived data
     * 
     * @param domains  the domains which the key belongs to
     */
    async selectArchived(domains: Set<string>): Promise<SiteInfo[]> {
        const items = await this.refresh()
        const result: SiteInfo[] = []
        for (const key in items) {
            if (domains.has(key)) {
                const waste: WastePerDay = items[key]
                const { focus, total, time } = waste
                result.push({ focus, total, time, host: key, date: undefined })
            }
        }
        return await Promise.resolve(result)
    }
}

export default new ArchivedDatabase()