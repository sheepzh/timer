/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import HostAlias, { HostAliasSource } from "@entity/dao/host-alias"
import HostAliasDatabase, { HostAliasCondition } from "@db/host-alias-database"
import IconUrlDatabase from "@db/icon-url-database"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import { PageParam, PageResult, slicePageResult } from "./components/page-info"

const storage = chrome.storage.local
const hostAliasDatabase = new HostAliasDatabase(storage)
const iconUrlDatabase = new IconUrlDatabase(storage)

export type HostAliasQueryParam = HostAliasCondition

class HostAliasService {
    async selectByPage(param?: HostAliasQueryParam, page?: PageParam): Promise<PageResult<HostAliasInfo>> {
        const origin: HostAlias[] = await hostAliasDatabase.select(param)
        const result: PageResult<HostAliasInfo> = slicePageResult(origin, page);
        const list: HostAliasInfo[] = result.list
        await this.fillIconUrl(list)
        return result
    }

    async remove(host: string): Promise<void> {
        await hostAliasDatabase.remove(host)
    }

    async change(host: string, name: string): Promise<void> {
        const toUpdate: HostAlias = { host, name, source: HostAliasSource.USER }
        await hostAliasDatabase.update(toUpdate)
    }

    exist(host: string): Promise<boolean> {
        return hostAliasDatabase.exist(host)
    }

    existBatch(hosts: string[]): Promise<{ [host: string]: boolean }> {
        return hostAliasDatabase.existBatch(hosts)
    }

    /**
     * @since 0.9.0
     */
    async get(host: string): Promise<HostAlias | undefined> {
        const result = await hostAliasDatabase.get(host)
        return result[host]
    }

    private async fillIconUrl(items: HostAliasInfo[]): Promise<void> {
        const hosts = items.map(o => o.host)
        const iconUrlMap = await iconUrlDatabase.get(...hosts)
        items.forEach(items => items.iconUrl = iconUrlMap[items.host])
    }
}

export default new HostAliasService()
