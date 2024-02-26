/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import SiteDatabase, { SiteCondition } from "@db/site-database"
import { slicePageResult } from "./components/page-info"

const storage = chrome.storage.local
const siteDatabase = new SiteDatabase(storage)

export type SiteQueryParam = SiteCondition

async function removeAlias(this: SiteService, key: timer.site.SiteKey) {
    const exist = await siteDatabase.get(key)
    if (!exist) return
    delete exist.alias
    delete exist.source
    await siteDatabase.save(exist)
}

async function saveAlias(this: SiteService, key: timer.site.SiteKey, alias: string, source: timer.site.AliasSource) {
    const exist = await siteDatabase.get(key)
    let toUpdate: timer.site.SiteInfo
    if (exist) {
        // Can't overwrite existed by user
        const canSave = source === 'USER' || exist.source !== 'USER'
        if (!canSave) return
        toUpdate = exist
        toUpdate.alias = alias
        toUpdate.source = source
    } else {
        toUpdate = { ...key, alias, source }
    }
    await siteDatabase.save(toUpdate)
}

async function saveIconUrl(this: SiteService, key: timer.site.SiteKey, iconUrl: string) {
    const exist = await siteDatabase.get(key)
    let toUpdate: timer.site.SiteInfo
    if (exist) {
        toUpdate = { ...exist }
        toUpdate.iconUrl = iconUrl
    } else {
        toUpdate = { ...key, iconUrl }
    }
    await siteDatabase.save(toUpdate)
}

class SiteService {
    async add(siteInfo: timer.site.SiteInfo): Promise<void> {
        if (await siteDatabase.exist(siteInfo)) {
            return
        }
        await siteDatabase.save(siteInfo)
    }

    async selectByPage(param?: SiteQueryParam, page?: timer.common.PageQuery): Promise<timer.common.PageResult<timer.site.SiteInfo>> {
        const origin: timer.site.SiteInfo[] = await siteDatabase.select(param)
        const result: timer.common.PageResult<timer.site.SiteInfo> = slicePageResult(origin, page);
        return result
    }

    selectAll(param?: SiteQueryParam): Promise<timer.site.SiteInfo[]> {
        return siteDatabase.select(param)
    }

    async batchSelect(keys: timer.site.SiteKey[]): Promise<timer.site.SiteInfo[]> {
        return siteDatabase.getBatch(keys)
    }

    async remove(host: timer.site.SiteKey): Promise<void> {
        await siteDatabase.remove(host)
    }

    saveAlias = saveAlias

    removeAlias = removeAlias

    saveIconUrl = saveIconUrl

    exist(host: timer.site.SiteKey): Promise<boolean> {
        return siteDatabase.exist(host)
    }

    existBatch(hosts: timer.site.SiteKey[]): Promise<timer.site.SiteKey[]> {
        return siteDatabase.existBatch(hosts)
    }

    /**
     * @since 0.9.0
     */
    async get(host: timer.site.SiteKey): Promise<timer.site.SiteInfo | undefined> {
        return await siteDatabase.get(host)
    }
}

export default new SiteService()
