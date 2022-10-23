/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import ArchivedDatabase from "@db/archived-database"
import { log } from "@src/common/logger"
import IVersionProcessor from "../i-version-processor"

/**
 * All code will be removed at v1.4.0
 */
export default class ArchivedDataCleaner implements IVersionProcessor {
    since(): string {
        return '1.3.0'
    }

    async process(reason: chrome.runtime.OnInstalledReason): Promise<void> {
        const db = new ArchivedDatabase(chrome.storage.local)
        if (reason !== 'update') {
            return
        }
        const count = await db.removeAll()
        log(`Removed ${count} archived items`)
    }
}