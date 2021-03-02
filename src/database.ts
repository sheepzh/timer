import { format } from "./util/time"

/**
 * Time waste per day
 * 
 * @since 1.0.0
 */
export class WastePerDay {
    /**
     * Duration of visit
     */
    total: number
    /**
     * Duration of focus
     */
    focus: number
    /**
     * Visit times
     */
    time: number
    constructor() {
        this.total = 0
        this.focus = 0
        this.time = 0
    }
}

export class Row {
    host: string
    date: string
    total: number
    focus: number
    time: number
}

export class QueryParam {
    date?: Date
    /**
     * Group by the root domain
     */
    byRoot?: boolean
}

class Database {

    private items = {}

    private localStorage = chrome.storage.local

    public refresh(callback?: Function) {
        this.localStorage.get(result => {
            this.items = {}
            for (let key in result) {
                if (key !== 'config' && key !== 'blacklist') {
                    // remain words
                    this.items[key] = result[key]
                }
            }
            callback && callback(this.items)
        })
    }

    constructor() {
        this.refresh()
    }

    private resolveTodayOf(host: string, resolver: (w: WastePerDay) => void) {
        const key = format(new Date()) + host
        const todayInfo = this.items[key] || new WastePerDay()
        resolver(todayInfo)
        this.items[key] = todayInfo

        const toUpdate = {}
        toUpdate[key] = todayInfo

        // May cause error: Extension context invalidated.
        try {
            this.localStorage.set(toUpdate)
        } catch {
            // Ignore
        }
    }

    public addTotal(host: string, total: number) {
        this.resolveTodayOf(host, (i: WastePerDay) => i.total += total)
    }

    public addFocus(host: string, focus: number) {
        this.resolveTodayOf(host, (i: WastePerDay) => i.focus += focus)
    }

    public addOneTime(host: string) {
        this.resolveTodayOf(host, (i: WastePerDay) => i.time = (i.time || 0) + 1)
    }

    public select(param?: QueryParam): Row[] {
        param = param || new QueryParam()
        let result: Row[] = []
        for (let key in this.items) {
            const date = key.substr(0, 8)
            const host = key.substring(8)
            const val: WastePerDay = this.items[key]
            const satisifed = this.satisify(date, host, val, param)
            const { total, focus, time } = val
            result.push({ date, host, total, focus, time })
        }
        if (param.byRoot) {
            result = this.resolveRoot(result)
        }
        return result
    }

    private satisify(date: string, host: string, val: WastePerDay, param: QueryParam) {
        if (!!param.date && format(param.date) !== date) {
            return false
        }
        return true
    }

    private resolveRoot(origin: Row[]): Row[] {
        const newRows = []
        const map = {}
        origin.forEach(o => {
            const host = o.host
            let domain = host
            let dotIndex = host.lastIndexOf('.')
            if (dotIndex !== -1) {
                const pre = host.substring(0, dotIndex)
                dotIndex = pre.lastIndexOf('.')
                if (dotIndex !== -1) {
                    domain = host.substring(dotIndex + 1)
                }
            }

            const exist: Row = map[domain]
            if (exist === undefined) {
                o.host = domain
                map[domain] = o
            } else {
                exist.time += o.time
                exist.focus += o.focus
                exist.total += o.total
            }
        })
        for (let key in map) {
            newRows.push(map[key])
        }
        return newRows
    }

    public getTodayOf(host: string) {
        return this.items[format(new Date()) + host] || new WastePerDay()
    }
}

export default new Database()
