/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import HostAliasDatabase, { HostAliasCondition } from "@db/host-alias-database"
import IconUrlDatabase from "@db/icon-url-database"
import { slicePageResult } from "./components/page-info"


const storage = chrome.storage.local
const hostAliasDatabase = new HostAliasDatabase(storage)
const iconUrlDatabase = new IconUrlDatabase(storage)

export type HostAliasQueryParam = HostAliasCondition

class HostAliasService {
    async selectByPage(param?: HostAliasQueryParam, page?: timer.common.PageQuery): Promise<timer.common.PageResult<timer.site.AliasIcon>> {
        const origin: timer.site.Alias[] = await hostAliasDatabase.select(param)
        const result: timer.common.PageResult<timer.site.AliasIcon> = slicePageResult(origin, page);
        const list: timer.site.AliasIcon[] = result.list
        await this.fillIconUrl(list)
        return result
    }

    async remove(host: timer.site.AliasKey): Promise<void> {
        await hostAliasDatabase.remove(host)
    }

    async change(key: timer.site.AliasKey, name: string): Promise<void> {
        const toUpdate: timer.site.Alias = { ...key, name, source: 'USER' }
        await hostAliasDatabase.update(toUpdate)
    }

    exist(host: timer.site.AliasKey): Promise<boolean> {
        return hostAliasDatabase.exist(host)
    }

    existBatch(hosts: timer.site.AliasKey[]): Promise<timer.site.AliasKey[]> {
        return hostAliasDatabase.existBatch(hosts)
    }

    /**
     * @since 0.9.0
     */
    async get(host: timer.site.AliasKey): Promise<timer.site.Alias | undefined> {
        const result = await hostAliasDatabase.get(host)
        return result?.[0]
    }

    private async fillIconUrl(items: timer.site.AliasIcon[]): Promise<void> {
        const hosts = items.map(o => o.host)
        const iconUrlMap = await iconUrlDatabase.get(...hosts)
        items.forEach(items => items.iconUrl = iconUrlMap[items.host])
    }
}

export default new HostAliasService()
