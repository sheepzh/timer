/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const DB_KEY_PREFIX = REMAIN_WORD_PREFIX + "ALIAS"
const DB_KEY_PREFIX_M = REMAIN_WORD_PREFIX + "ALIASM"

type _AliasSourceAbbr = 'u' | 'd'

const SOURCE_PREFIX_MAP: Record<timer.site.AliasSource, _AliasSourceAbbr> = {
    USER: 'u',
    DETECTED: 'd'
}
const ABBR_MAP: Record<_AliasSourceAbbr, timer.site.AliasSource> = {
    u: 'USER',
    d: 'DETECTED'
}

function generateKey(aliasKey: timer.site.AliasKey): string {
    return (aliasKey.merged ? DB_KEY_PREFIX_M : DB_KEY_PREFIX) + aliasKey.host
}

function aliasKeyOf(key: string): timer.site.AliasKey {
    if (key.startsWith(DB_KEY_PREFIX_M)) {
        return {
            host: key.substring(DB_KEY_PREFIX_M.length),
            merged: true
        }
    } else {
        return {
            host: key.substring(DB_KEY_PREFIX.length),
            merged: false
        }
    }
}

function valueOf(aliasKey: timer.site.AliasKey, value: string): timer.site.Alias {
    const abbr = value.substring(0, 1) as _AliasSourceAbbr

    return {
        ...aliasKey,
        source: ABBR_MAP[abbr],
        name: value.substring(1)
    }
}

export type HostAliasCondition = {
    host?: string
    alias?: string
    source?: timer.site.AliasSource
}

/**
 * @author zhy
 * @since 0.5.0
 */
class HostAliasDatabase extends BaseDatabase {
    /**
     * Update the alias
     */
    async update(toUpdate: timer.site.Alias): Promise<void> {
        const { name, source } = toUpdate
        const key = generateKey(toUpdate)
        const value = SOURCE_PREFIX_MAP[source] + name
        if (source === 'USER') {
            // Force update
            return this.storage.put(key, value)
        }
        const existVal = await this.storage.getOne(key)
        if (!existVal || typeof existVal !== 'string') {
            // Force update
            return this.storage.put(key, value)
        }
        const abbr = (existVal as string).substring(0, 1) as _AliasSourceAbbr
        if (abbr === 'd') {
            // Update
            return this.storage.put(key, value)
        }
    }

    async selectAll(): Promise<timer.site.Alias[]> {
        return this.select()
    }

    async select(queryParam?: HostAliasCondition): Promise<timer.site.Alias[]> {
        const host = queryParam?.host
        const alias = queryParam?.alias
        const source = queryParam?.source
        const data = await this.storage.get()
        return Object.keys(data)
            .filter(key => key.startsWith(DB_KEY_PREFIX))
            .map(key => {
                const aliasKey = aliasKeyOf(key)
                const value = data[key]
                return valueOf(aliasKey, value)
            })
            .filter(hostAlias => {
                if (host && !hostAlias.host.includes(host)) return false
                if (alias && !hostAlias.name.includes(alias)) return false
                if (source && source !== hostAlias.source) return false
                return true
            })
    }

    async get(...hosts: timer.site.AliasKey[]): Promise<timer.site.Alias[]> {
        const keys = hosts.map(generateKey)
        const items = await this.storage.get(keys)
        const result = []
        Object.entries(items).forEach(([key, value]) => {
            const aliasKey = aliasKeyOf(key)
            result.push(valueOf(aliasKey, value))
        })
        return Promise.resolve(result)
    }

    async exist(host: timer.site.AliasKey): Promise<boolean> {
        const key = generateKey(host)
        const items = await this.storage.get(key)
        return !!items[key]
    }

    async existBatch(hosts: timer.site.AliasKey[]): Promise<timer.site.AliasKey[]> {
        const keys = hosts.map(generateKey)
        const items = await this.storage.get(keys)
        const result: timer.site.AliasKey[] = []
        Object.entries(items).map(([key]) => aliasKeyOf(key)).forEach(host => result.push(host))
        return result
    }

    async remove(host: timer.site.AliasKey) {
        const key = generateKey(host)
        await this.storage.remove(key)
    }

    async importData(data: any): Promise<void> {
        const items = await this.storage.get()
        const toSave = {}
        Object.entries(data)
            .filter(([key, value]) => key.startsWith(DB_KEY_PREFIX) && !!value && typeof value === 'string')
            .forEach(([key, value]) => toSave[key] = this.migrate(items[key], value as string))
        await this.storage.set(toSave)
    }

    private migrate(exist: string | undefined, toUpdate: string): string {
        if (!exist) {
            return toUpdate
        }
        if (exist.startsWith('u') && !toUpdate.startsWith('u')) {
            return exist
        }
        return toUpdate
    }
}

export default HostAliasDatabase