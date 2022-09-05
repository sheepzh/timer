/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const PREFIX = REMAIN_WORD_PREFIX + "backup"
const SNAPSHOT_KEY = PREFIX + "_snap"
const CACHE_KEY = PREFIX + "_cache"

function cackeKeyOf(type: timer.backup.Type) {
    return CACHE_KEY + "_" + type
}

class BackupDatabase extends BaseDatabase {

    constructor(storage: chrome.storage.StorageArea) {
        super(storage)
    }

    async getSnapshot(type: timer.backup.Type): Promise<timer.backup.Snapshot | undefined> {
        const cache = await this.storage.getOne(SNAPSHOT_KEY) as timer.backup.SnaptshotCache
        return cache?.[type]
    }

    async updateSnapshot(type: timer.backup.Type, snapshot: timer.backup.Snapshot): Promise<void> {
        const cache = (await this.storage.getOne(SNAPSHOT_KEY) as timer.backup.SnaptshotCache) || {}
        cache[type] = snapshot
        await this.storage.put(SNAPSHOT_KEY, cache)
    }

    async getCache(type: timer.backup.Type): Promise<unknown> {
        return (await this.storage.getOne(cackeKeyOf(type))) || {}
    }

    async updateCache(type: timer.backup.Type, newVal: unknown): Promise<void> {
        return this.storage.put(cackeKeyOf(type), newVal)
    }

    importData(_data: any): Promise<void> {
        // Do nothing
        return
    }
}

export default BackupDatabase