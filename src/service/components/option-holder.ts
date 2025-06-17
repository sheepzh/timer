import { onPermRemoved } from "@api/chrome/permission"
import db from "@db/option-database"
import { type DefaultOption, defaultOption } from "@util/constant/option"

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

    listenPermChange() {
        onPermRemoved(perm => {
            perm.permissions?.includes('tabGroups') && this.set({ countTabGroup: false })
        })
    }

    private async reset(): Promise<DefaultOption> {
        const exist: Partial<timer.option.AllOption> = await db.getOption()
        const result = defaultOption()
        Object.entries(exist).forEach(([key, val]) => (result as any)[key] = val)
        this.option = result
        return result
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