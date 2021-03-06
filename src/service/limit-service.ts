import { DATE_FORMAT } from "../database/common/constant"
import LimitDatabase from "../database/limit-database"
import WhitelistDatabase from "../database/whitelist-database"
import { TimeLimit } from "../entity/dao/time-limit"
import TimeLimitItem from "../entity/dto/time-limit-item"
import { formatPeriod, formatTime } from "../util/time"

const storage = chrome.storage.local
const db: LimitDatabase = new LimitDatabase(storage)
const whitelistDatabase = new WhitelistDatabase(storage)

export type QueryParam = {
    filterDisabled: boolean
    url: string
}

async function select(cond?: QueryParam): Promise<TimeLimitItem[]> {
    const { filterDisabled, url } = cond ? cond : { filterDisabled: undefined, url: undefined }
    const today = formatTime(new Date(), DATE_FORMAT)
    return (await db.all())
        .filter(item => filterDisabled ? item.enabled : true)
        .map(({ cond, time, enabled, wasteTime, latestDate }) =>
            TimeLimitItem.of(cond, time, enabled, latestDate === today ? wasteTime : 0)
        )
        // If use url, then test it
        .filter(item => url ? item.matches(url) : true)
}

async function update({ cond, time, enabled }: TimeLimitItem): Promise<void> {
    const limit: TimeLimit = { cond, time, enabled }
    await db.save(limit, true)
}

function remove(cond: string): Promise<void> {
    return db.remove(cond)
}

async function getLimitted(url: string): Promise<TimeLimitItem[]> {
    const list: TimeLimitItem[] = (await select())
        .filter(item => item.enabled)
        .filter(item => item.matches(url))
        .filter(item => item.hasLimitted())
    return list
}

/**
 * Add time
 * @param url url 
 * @param focusTime time, millseconds 
 */
async function addFocusTime(url: string, focusTime: number) {
    const allEnabled = await select({ filterDisabled: true, url })
    const toUpdate: { [cond: string]: number } = {}
    allEnabled.forEach(item => toUpdate[item.cond] = item.waste += focusTime)
    return db.updateWaste(formatTime(new Date, DATE_FORMAT), toUpdate)
}

async function moreMinutes(url: string, rules: TimeLimitItem[]): Promise<void> {
    const date = formatTime(new Date(), DATE_FORMAT)
    const toUpdate: { [cond: string]: number } = {}
    rules.forEach(({ cond, waste }) => {
        const updatedWaste = (waste || 0) - 5 * 60 * 1000
        toUpdate[cond] = updatedWaste < 0 ? 0 : updatedWaste
    })
    await db.updateWaste(date, toUpdate)
}

class LimitService {
    private whitelist: string[] = []

    constructor() {
        const whitelistSetter = (whitelist: string[]) => this.whitelist = whitelist
        whitelistDatabase.selectAll().then(whitelistSetter)
        whitelistDatabase.addChangeListener(whitelistSetter)
    }

    moreMinutes = moreMinutes
    getLimitted = getLimitted
    update = update
    select = select
    remove = remove
    addFocusTime = (host: string, url: string, focusTime: number) => !this.whitelist.includes(host) && addFocusTime(url, focusTime)
}

export default new LimitService()