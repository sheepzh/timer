/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import HostAlias, { HostAliasSource } from "../entity/dto/host-alias"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const DB_KEY_PREFIX = REMAIN_WORD_PREFIX + "ALIAS"
const DB_KEY_PREFIX_LENGTH = DB_KEY_PREFIX.length

const SOURCE_PREFIX_MAP: { [source in HostAliasSource]: string } = {
    USER: 'u',
    DETECTED: 'd'
}
const ABBR_MAP = {
    'u': HostAliasSource.USER,
    'd': HostAliasSource.DETECTED
}

const generateKey = (host: string) => DB_KEY_PREFIX + host
const hostOf = (key: string) => key.substring(DB_KEY_PREFIX_LENGTH)
function valueOf(host: string, value: string): HostAlias {
    const abbr = value.substr(0, 1)

    return {
        host,
        source: ABBR_MAP[abbr],
        name: value.substr(1)
    }
}

/**
 * @author zhy
 * @since 0.4.1
 */
class HostAliasDatabase extends BaseDatabase {
    /**
     * Update the alias
     */
    async update(toUpdate: HostAlias): Promise<void> {
        const { host, name, source } = toUpdate
        const key = generateKey(host)
        const value = SOURCE_PREFIX_MAP[source] + name
        if (source === HostAliasSource.USER) {
            // Force update
            return this.storage.put(key, value)
        }
        const existVal = this.storage.getOne(key)
        if (!existVal || typeof existVal !== 'string') {
            // Force update
            return this.storage.put(key, value)
        }
        const abbr = (existVal as string).substring(0, 1)
        if (ABBR_MAP[abbr] === HostAliasSource.DETECTED) {
            // Update
            return this.storage.put(key, value)
        }
    }

    async selectAll(): Promise<HostAlias[]> {
        const data = await this.storage.get()
        return Object.keys(data)
            .filter(key => key.startsWith(DB_KEY_PREFIX))
            .map(key => {
                const host = hostOf(key)
                const value = data[key]
                return valueOf(host, value)
            })
    }

    async get(...hosts: string[]): Promise<{ [host: string]: HostAlias }> {
        const keys = hosts.map(generateKey)
        const items = await this.storage.get(keys)
        const result = {}
        Object.entries(items).forEach(([key, value]) => {
            const host = hostOf(key)
            result[host] = valueOf(host, value)
        })
        return Promise.resolve(result)
    }

    async remove(host: string) {
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