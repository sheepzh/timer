import OptionDatabase from "@db/option-database"
import { locale } from "@i18n"
import { formatTimeYMD, getRealWeekStart, getWeekTime } from "@util/time"

class WeekHelper {
    private optionDb = new OptionDatabase(chrome.storage.local)
    private weekStart: timer.option.WeekStartOption
    private initialized: boolean = false

    private async init(): Promise<void> {
        const option = await this.optionDb.getOption()
        this.weekStart = option?.weekStart
        this.optionDb.addOptionChangeListener(val => this.weekStart = val?.weekStart)
        this.initialized = true
    }

    async getWeekDateRange(now: Date): Promise<[startDate: string, endDateOrToday: string]> {
        const weekStart = await this.getWeekStart()
        const [start, end] = getWeekTime(now, weekStart, locale)
        return [formatTimeYMD(start), formatTimeYMD(end)]
    }

    private async getWeekStart(): Promise<timer.option.WeekStartOption> {
        if (!this.initialized) {
            await this.init()
        }
        return this.weekStart
    }

    /**
     * Week start
     *
     * @returns 0-6
     */
    async getRealWeekStart(): Promise<number> {
        const weekStart = await this.getWeekStart()
        return getRealWeekStart(weekStart, locale) - 1
    }
}

export default new WeekHelper()