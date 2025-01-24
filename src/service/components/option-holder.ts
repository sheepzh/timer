import OptionDatabase from "@db/option-database"
import { defaultOption } from "@util/constant/option"

const db = new OptionDatabase(chrome.storage.local)

function migrateOld(result: timer.option.AllOption): timer.option.AllOption {
    if (!result) return result
    const newRes = { ...result }
    const duration = newRes['defaultDuration']
    if (duration as string === 'last30Days') {
        // old option, deprecated since v2.5.3, Nov 23 2024
        newRes.defaultDuration = 'lastDays'
        newRes.defaultDurationNum = 30
    }
    return newRes
}

type ChangeListener = (option: timer.option.AllOption) => void

class OptionHolder {
    private option: timer.option.AllOption
    private listeners: ChangeListener[] = []

    constructor() {
        db.addOptionChangeListener(async () => {
            await this.reset()
            this.listeners.forEach(listener => listener?.(this.option))
        })
    }

    private async reset(): Promise<void> {
        const exist: Partial<timer.option.AllOption> = await db.getOption()
        const result: timer.option.AllOption = defaultOption()
        Object.entries(exist).forEach(([key, val]) => result[key] = val)
        const newVal = migrateOld(result)
        this.option = newVal
    }

    async get(): Promise<timer.option.AllOption> {
        if (!this.option) {
            await this.reset()
        }
        return this.option
    }

    async set(option: Partial<timer.option.AllOption>): Promise<void> {
        const exist: Partial<timer.option.AllOption> = await db.getOption()
        const toSet = defaultOption()
        Object.entries(exist).forEach(([key, val]) => toSet[key] = val)
        Object.entries(option).forEach(([key, val]) => toSet[key] = val)
        await db.setOption(toSet)
    }

    addChangeListener(listener: ChangeListener) {
        listener && this.listeners.push(listener)
    }
}

export default new OptionHolder()