/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import HostAlias, { HostAliasSource } from "../entity/dao/host-alias"
import HostAliasDatabase, { HostAliasCondition } from "../database/host-alias-database"
import IconUrlDatabase from "../database/icon-url-database"
import { HostAliasInfo } from "../entity/dto/host-alias-info"

const storage = chrome.storage.local
const hostAliasDatabase = new HostAliasDatabase(storage)
const iconUrlDatabase = new IconUrlDatabase(storage)

declare type PageParam = {
    pageNum?: number
    pageSize?: number
}

declare type PageInfo = {
    total: number
    list: HostAliasInfo[]
}

export type HostAliasQueryParam = HostAliasCondition

class HostAliasService {
    async selectByPage(param?: HostAliasQueryParam, page?: PageParam): Promise<PageInfo> {
        page = page || { pageNum: 1, pageSize: 10 }
        const origin: HostAlias[] = await hostAliasDatabase.select(param)
        // Page
        let pageNum = page.pageNum
        let pageSize = page.pageSize
        pageNum === undefined || pageNum < 1 && (pageNum = 1)
        pageSize === undefined || pageSize < 1 && (pageSize = 10)
        const startIndex = (pageNum - 1) * pageSize
        const endIndex = (pageNum) * pageSize
        const total = origin.length
        const list: HostAliasInfo[] = startIndex >= total ? [] : origin.slice(startIndex, Math.min(endIndex, total))
        await this.fillIconUrl(list)
        return { total, list }
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

    private async fillIconUrl(items: HostAliasInfo[]): Promise<void> {
        const hosts = items.map(o => o.host)
        const iconUrlMap = await iconUrlDatabase.get(...hosts)
        items.forEach(items => items.iconUrl = iconUrlMap[items.host])
    }
}

export default HostAliasService
