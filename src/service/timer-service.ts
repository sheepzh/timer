import timeDatabase from '../database/timer-database'
import whitelistDatabase from '../database/whitelist-database'

/**
 * Service of timer
 * @since 0.0.5
 */
class TimeService {

    public addTotal(url: string, start: number) {
        this.notInWhitelistThen(url, () => timeDatabase.addTotal(url, start))
    }

    public addFocusAndTotal(url: string, focusStart: number, runStart: number) {
        this.notInWhitelistThen(url, () => timeDatabase.addFocusAndTotal(url, focusStart, runStart))
    }

    public addOneTime(url: string) {
        this.notInWhitelistThen(url, () => timeDatabase.addOneTime(url))
    }

    private notInWhitelistThen(url: string, hook: () => void) {
        !!url && whitelistDatabase.includes(url, include => !include && hook())
    }
}

export default new TimeService()