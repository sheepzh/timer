import OptionDatabase from "@db/option-database"
import { type DefaultOption, defaultOption } from "@util/constant/option"

const db = new OptionDatabase(chrome.storage.local)

function migrateOld<T extends timer.option.AllOption>(result: T): T {
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
    private option: DefaultOption | undefined
    private listeners: ChangeListener[] = []

    constructor() {
        db.addOptionChangeListener(async () => {
            const option = await this.reset()
            this.listeners.forEach(listener => listener?.(option))
        })
    }

    private async reset(): Promise<DefaultOption> {
        const exist: Partial<timer.option.AllOption> = await db.getOption()
        const result = defaultOption()
        Object.entries(exist).forEach(([key, val]) => (result as any)[key] = val)
        const newVal = migrateOld(result)
        this.option = newVal
        return newVal
    }

    async get(): Promise<DefaultOption> {
        return this.option ?? await this.reset()
    }

    async set(option: Partial<timer.option.AllOption>): Promise<void> {
        const exist: Partial<timer.option.AllOption> = await db.getOption()
        const toSet = defaultOption()
        Object.entries(exist).forEach(([key, val]) => (toSet as any)[key] = val)
        Object.entries(option).forEach(([key, val]) => (toSet as any)[key] = val)
        await db.setOption(toSet)
    }

    addChangeListener(listener: ChangeListener) {
        listener && this.listeners.push(listener)
    }
}

export default new OptionHolder()