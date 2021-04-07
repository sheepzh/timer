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

    public refresh(callback?: ({ }) => void) {
        this.localStorage.get(result => {
            const items = {}
            for (let key in result) {
                if (key.startsWith(ARCHIVED_PREFIX)) {
                    items[key.substr(ARCHIVED_PREFIX.length)] = result[key]
                }
            }
            log('All archived', items)
            callback && callback(items)
        })
    }

    private generateKey(row: SiteInfo): string {
        return ARCHIVED_PREFIX + row.host
    }

    /**
     * Archive by key
     *  
     * @param rows     site rows, the host and date mustn't be null
     * @param callback callback
     */
    public updateArchived(rows: SiteInfo[], callback?: () => void): void {
        const domainSet: Set<string> = new Set()
        rows = rows.filter(({ date, host }) => !!host && !!date)
        rows.forEach(({ host }) => domainSet.add(host))
        this.selectArchived((archived: SiteInfo[]) => {
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
            this.rewrite(Object.values(archiveMap), callback)
        }, domainSet)
    }

    private rewrite(toWrite: SiteInfo[], callback?: () => void) {
        const promises: Promise<void>[] = toWrite.map(tw => {
            const object = {}
            const { total, focus, time } = tw
            object[this.generateKey(tw)] = { total, focus, time }
            return new Promise((resolve, _) => this.localStorage.set(object, resolve))
        })
        Promise.all(promises).then(callback)
    }

    /**
     * Select the archived data
     * 
     * @param callback callback
     * @param domains  the domains which the key belongs to
     */
    public selectArchived(callback: (archived: SiteInfo[]) => void, domains: Set<string>): void {
        this.refresh((items: { waste: WastePerDay }) => {
            const result: SiteInfo[] = []
            for (const key in items) {
                if (domains.has(key)) {
                    const waste: WastePerDay = items[key]
                    const { focus, total, time } = waste
                    result.push({ focus, total, time, host: key, date: undefined })
                }
            }
            callback(result)
        })
    }
}

export default new ArchivedDatabase()