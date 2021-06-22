import PeriodDatabase from "../database/period-database"
import { calculate } from "./period-calculator"

const periodDatabase = new PeriodDatabase(chrome.storage.local)

function add(timestamp: number, millseconds: number): Promise<void> {
    const results = calculate(timestamp, millseconds)
    console.log(results)
    return periodDatabase.accumulate(results)
}

class PeriodService {
    public add = add
}

export default new PeriodService()