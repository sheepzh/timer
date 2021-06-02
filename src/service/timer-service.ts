import timerDatabase, { QueryParam } from '../database/timer-database'
import whitelistDatabase from '../database/whitelist-database'
import archivedDatabase from '../database/archived-database'
import SiteInfo from '../entity/dto/site-info'

/**
 * Service of timer
 * @since 0.0.5
 */
class TimeService {

    addTotal(url: string, start: number) {
        this.notInWhitelistThen(url)
            .then(() => timerDatabase.addTotal(url, start))
    }

    addFocusAndTotal(url: string, focusStart: number, runStart: number) {
        this.notInWhitelistThen(url)
            .then(() => timerDatabase.addFocusAndTotal(url, focusStart, runStart))
    }

    addOneTime(url: string) {
        this.notInWhitelistThen(url)
            .then(() => timerDatabase.addOneTime(url))
    }

    private notInWhitelistThen(url: string): Promise<void> {
        return !!url && whitelistDatabase
            .includes(url)
            .then(include => {
                if (!include) return Promise.resolve()
            })
    }

    /**
     * Query domain names
     * 
     * @param fuzzyQuery the part of domain name
     * @since 0.0.8
     */
    async listDomains(fuzzyQuery: string): Promise<Set<string>> {
        const param: QueryParam = new QueryParam()
        param.host = fuzzyQuery
        const rows = await timerDatabase.select(param)
        const result: Set<string> = new Set()
        rows.forEach(row => result.add(row.host))
        return Promise.resolve(result)
    }

    /**
     * Archive the data and delete all of them
     * 
     * @param rows rows
     * @since 0.0.9
     */
    async archive(rows: SiteInfo[]): Promise<void> {
        await archivedDatabase.updateArchived(rows)
        return timerDatabase.delete(rows)
    }
}

export default new TimeService()