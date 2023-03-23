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

const ABBR_MAP: Record<_AliasSourceAbbr, timer.site.AliasSource> = {
    u: 'USER',
    d: 'DETECTED'
}

function generateKey(SiteKey: timer.site.SiteKey): string {
    return (SiteKey.merged ? DB_KEY_PREFIX_M : DB_KEY_PREFIX) + SiteKey.host
}

function SiteKeyOf(key: string): timer.site.SiteKey {
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

function valueOf(SiteKey: timer.site.SiteKey, value: string): timer.site.SiteInfo {
    const abbr = value.substring(0, 1) as _AliasSourceAbbr

    return {
        ...SiteKey,
        source: ABBR_MAP[abbr],
        alias: value.substring(1)
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
 * @deprecated Use SiteDatabase
 */
class HostAliasDatabase extends BaseDatabase {

    async selectAll(): Promise<timer.site.SiteInfo[]> {
        return this.select()
    }

    async select(queryParam?: HostAliasCondition): Promise<timer.site.SiteInfo[]> {
        const host = queryParam?.host
        const alias = queryParam?.alias
        const source = queryParam?.source
        const data = await this.storage.get()
        return Object.keys(data)
            .filter(key => key.startsWith(DB_KEY_PREFIX))
            .map(key => {
                const SiteKey = SiteKeyOf(key)
                const value = data[key]
                return valueOf(SiteKey, value)
            })
            .filter(hostAlias => {
                if (host && !hostAlias.host.includes(host)) return false
                if (alias && !hostAlias.alias.includes(alias)) return false
                if (source && source !== hostAlias.source) return false
                return true
            })
    }

    async remove(host: timer.site.SiteKey) {
        const key = generateKey(host)
        await this.storage.remove(key)
    }

    async importData(data: any): Promise<void> {
        // Do nothing
    }
}

export default HostAliasDatabase