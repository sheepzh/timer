import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const DB_KEY = REMAIN_WORD_PREFIX + 'OPTION'

/**
 * Database of options
 * 
 * @since 0.3.0
 */
class OptionDatabase extends BaseDatabase {
    async importData(data: any): Promise<void> {
        const newVal = data[DB_KEY]
        const exist = await this.getOption()
        if (exist) {
            Object.entries(exist).forEach(([key, value]) => exist[key] = value)
        }
        await this.setOption(newVal)
    }

    async getOption(): Promise<Partial<Timer.Option>> {
        const data = await this.storage.get(DB_KEY)
        if (!data) return {}
        return data as Partial<Timer.Option>
    }

    async setOption(option: Timer.Option): Promise<void> {
        option && await this.setByKey(DB_KEY, option)
    }
}