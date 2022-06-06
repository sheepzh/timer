/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import packageInfo from "@src/package"
import ArchivedDatabase from "@db/archived-database"
import BaseDatabase from "@db/common/base-database"
import StoragePromise from "@db/common/storage-promise"
import IconUrlDatabase from "@db/icon-url-database"
import LimitDatabase from "@db/limit-database"
import MergeRuleDatabase from "@db/merge-rule-database"
import PeriodDatabase from "@db/period-database"
import TimerDatabase from "@db/timer-database"
import WhitelistDatabase from "@db/whitelist-database"
import HostAliasDatabase from "@db/host-alias-database"

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
        new WhitelistDatabase(storage),
        new HostAliasDatabase(storage)
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
        const meta: MetaInfo = { version: packageInfo.version, ts: Date.now() }
        data.__meta__ = meta
        return data
    }

    async importData(data: any): Promise<void> {
        for (const db of this.databaseArray) await db.importData(data)
    }
}

export default Immigration