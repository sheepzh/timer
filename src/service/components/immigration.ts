/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "@db/common/base-database"
import StoragePromise from "@db/common/storage-promise"
import limitDatabase from "@db/limit-database"
import mergeRuleDatabase from "@db/merge-rule-database"
import periodDatabase from "@db/period-database"
import siteCateDatabase from "@db/site-cate-database"
import statDatabase from "@db/stat-database"
import whitelistDatabase from "@db/whitelist-database"
import packageInfo from "@src/package"

type MetaInfo = {
    version: string
    ts: number
}

export type BackupData = {
    __meta__: MetaInfo
} & any

function initDatabase(): BaseDatabase[] {
    const result: BaseDatabase[] = [
        statDatabase,
        periodDatabase,
        limitDatabase,
        mergeRuleDatabase,
        whitelistDatabase,
        siteCateDatabase,
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
        this.databaseArray = initDatabase()
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