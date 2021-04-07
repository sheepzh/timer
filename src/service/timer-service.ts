import timerDatabase, { QueryParam } from '../database/timer-database'
import whitelistDatabase from '../database/whitelist-database'
import archivedDatabase from '../database/archived-database'
import SiteInfo from '../entity/dto/site-info'

/**
 * Service of timer
 * @since 0.0.5
 */
class TimeService {

    public addTotal(url: string, start: number) {
        this.notInWhitelistThen(url, () => timerDatabase.addTotal(url, start))
    }

    public addFocusAndTotal(url: string, focusStart: number, runStart: number) {
        this.notInWhitelistThen(url, () => timerDatabase.addFocusAndTotal(url, focusStart, runStart))
    }

    public addOneTime(url: string) {
        this.notInWhitelistThen(url, () => timerDatabase.addOneTime(url))
    }

    private notInWhitelistThen(url: string, hook: () => void) {
        !!url && whitelistDatabase.includes(url, include => !include && hook())
    }

    /**
     * Query domain names
     * 
     * @param fuzzyQuery the part of domain name
     * @param callback callback
     * @since 0.0.8
     */
    public listDomains(fuzzyQuery: string, callback: (domains: Set<string>) => void) {
        const param: QueryParam = new QueryParam()
        param.host = fuzzyQuery
        timerDatabase.select(rows => {
            const result: Set<string> = new Set()
            rows.forEach(row => result.add(row.host))
            callback(result)
        }, param)
    }

    /**
     * Archive the data and delete all of them
     * 
     * @param rows rows
     * @since 0.0.9
     */
    public archive(rows: SiteInfo[], callback?: () => void) {
        archivedDatabase.updateArchived(rows,
            () => {
                timerDatabase.delete(rows, () => callback && callback())
            }
        )
    }
}

export default new TimeService()