import { version } from '../../package.json'
import ArchivedDatabase from '../database/archived-database'
import BaseDatabase from '../database/common/base-database'
import StoragePromise from "../database/common/storage-promise"
import IconUrlDatabase from '../database/icon-url-database'
import LimitDatabase from '../database/limit-database'
import MergeRuleDatabase from '../database/merge-rule-database'
import PeriodDatabase from '../database/period-database'
import TimerDatabase from '../database/timer-database'
import WhitelistDatabase from '../database/whitelist-database'

type MetaInfo = {
    version: string
    ts: number
}

export type BackupData = {
    __meta__: MetaInfo
} & any

function initDatabase(storage: chrome.storage.StorageArea): BaseDatabase[] {
    const result: BaseDatabase[] = [
        new TimerDatabase(storage),
        new IconUrlDatabase(storage),
        new PeriodDatabase(storage),
        new ArchivedDatabase(storage),
        new LimitDatabase(storage),
        new MergeRuleDatabase(storage),
        new WhitelistDatabase(storage)
    ]

    return result
}

/**
 * Data is citizens
 * 
 * @since 0.2.5
 */
class Immigration {
    private storage: StoragePromise
    private databaseArray: BaseDatabase[]

    constructor() {
        const localStorage = chrome.storage.local
        this.storage = new StoragePromise(localStorage)
        this.databaseArray = initDatabase(localStorage)
    }

    async getExportingData(): Promise<BackupData> {
        const data = await this.storage.get() as BackupData
        const meta: MetaInfo = { version, ts: Date.now() }
        data.__meta__ = meta
        return data
    }

    async importData(data: any): Promise<void> {
        for (const db of this.databaseArray) await db.importData(data)
    }
}

export default Immigration