/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

export type SiteCondition = {
    host?: string
    alias?: string
    /**
     * Fuzzy query of host or alias
     */
    fuzzyQuery?: string
    source?: timer.site.AliasSource
    virtual?: boolean
}

type _Entry = {
    /**
     * Alias
     */
    a?: string
    /**
     * Auto-detected
     */
    d?: boolean
    /**
     * Icon url
     */
    i?: string
}

const DB_KEY_PREFIX = REMAIN_WORD_PREFIX + 'SITE_'
const HOST_KEY_PREFIX = DB_KEY_PREFIX + 'h'
const VIRTUAL_KEY_PREFIX = DB_KEY_PREFIX + 'v'
const MERGED_FLAG = 'm'

function cvt2Key({ host, virtual, merged }: timer.site.SiteKey): string {
    return virtual
        ? VIRTUAL_KEY_PREFIX + host
        : HOST_KEY_PREFIX + (merged ? MERGED_FLAG : '_') + host
}

function cvt2SiteKey(key: string): timer.site.SiteKey {
    if (key?.startsWith(VIRTUAL_KEY_PREFIX)) {
        return {
            host: key.substring(VIRTUAL_KEY_PREFIX.length),
            virtual: true,
        }
    } else if (key?.startsWith(HOST_KEY_PREFIX)) {
        return {
            host: key.substring(HOST_KEY_PREFIX.length + 1),
            merged: key.charAt(HOST_KEY_PREFIX.length) === MERGED_FLAG
        }
    }
}

function cvt2Entry({ alias, source, iconUrl }: timer.site.SiteInfo): _Entry {
    const entry: _Entry = { i: iconUrl }
    alias && (entry.a = alias)
    source === 'DETECTED' && (entry.d = true)
    entry.i = iconUrl
    return entry
}

function cvt2SiteInfo(key: timer.site.SiteKey, entry: _Entry): timer.site.SiteInfo {
    if (!entry) return undefined
    const { a, d, i } = entry
    const siteInfo: timer.site.SiteInfo = { ...key }
    siteInfo.alias = a
    // Only exist if alias is not empty
    a && (siteInfo.source = d ? 'DETECTED' : 'USER')
    siteInfo.iconUrl = i
    return siteInfo
}

////////////////////////////////////////////////////////////////////////////
/////////////////////////                          /////////////////////////
/////////////////////////   PUBLIC METHODS START   /////////////////////////
/////////////////////////                          /////////////////////////
////////////////////////////////////////////////////////////////////////////

/**
 * Select by condition
 *
 * @returns list not be undefined, maybe empty
 */
async function select(this: SiteDatabase, condition?: SiteCondition): Promise<timer.site.SiteInfo[]> {
    const filter = buildFilter(condition)
    const data = await this.storage.get()
    return Object.entries(data)
        .filter(([key]) => key.startsWith(DB_KEY_PREFIX))
        .map(([key, value]) => cvt2SiteInfo(cvt2SiteKey(key), value as _Entry))
        .filter(filter)
}

function buildFilter(condition: SiteCondition): (site: timer.site.SiteInfo) => boolean {
    const { host, alias, source, virtual, fuzzyQuery } = condition || {}
    return site => {
        const { host: siteHost, alias: siteAlias, source: siteSource, virtual: siteVirtual } = site || {}
        if (host && !siteHost.includes(host)) return false
        if (alias && !siteAlias?.includes(alias)) return false
        if (source && source !== siteSource) return false
        if (virtual !== undefined && virtual !== null) {
            const virtualCond = virtual || false
            const virtualFactor = siteVirtual || false
            if (virtualCond !== virtualFactor) return false
        }
        if (fuzzyQuery && !(siteHost?.includes(fuzzyQuery) || siteAlias?.includes(fuzzyQuery))) return false
        return true
    }
}

/**
 * Get by key
 *
 * @returns site info, or undefined
 */
async function get(this: SiteDatabase, key: timer.site.SiteKey): Promise<timer.site.SiteInfo> {
    const entry: _Entry = await this.storage.getOne(cvt2Key(key))
    if (!entry) {
        return undefined
    }
    return cvt2SiteInfo(key, entry)
}

async function getBatch(this: SiteDatabase, keys: timer.site.SiteKey[]): Promise<timer.site.SiteInfo[]> {
    const result = await this.storage.get(keys.map(cvt2Key))
    return Object.entries(result)
        .map(([key, value]) => cvt2SiteInfo(cvt2SiteKey(key), value as _Entry))
}

/**
 * Save site info
 */
async function save(this: SiteDatabase, siteInfo: timer.site.SiteInfo): Promise<void> {
    this.storage.put(cvt2Key(siteInfo), cvt2Entry(siteInfo))
}

async function remove(this: SiteDatabase, siteKey: timer.site.SiteKey): Promise<void> {
    this.storage.remove(cvt2Key(siteKey))
}

async function exist(this: SiteDatabase, siteKey: timer.site.SiteKey): Promise<boolean> {
    const key = cvt2Key(siteKey)
    const entry: _Entry = await this.storage.getOne(key)
    return !!entry
}

async function existBatch(this: SiteDatabase, siteKeys: timer.site.SiteKey[]): Promise<timer.site.SiteKey[]> {
    const keys = siteKeys.map(cvt2Key)
    const items = await this.storage.get(keys)
    return Object.entries(items).map(([key]) => cvt2SiteKey(key))
}

async function importData(this: SiteDatabase, data: any) {
    throw new Error("Method not implemented.")
}

////////////////////////////////////////////////////////////////////////////
/////////////////////////                          /////////////////////////
/////////////////////////    PUBLIC METHODS END    /////////////////////////
/////////////////////////                          /////////////////////////
////////////////////////////////////////////////////////////////////////////

class SiteDatabase extends BaseDatabase {
    select = select
    get = get
    getBatch = getBatch
    save = save
    remove = remove
    exist = exist
    existBatch = existBatch

    importData = importData

    /**
     * Add listener to listen changes
     *
     * @since 1.6.0
     */
    addChangeListener(listener: (oldAndNew: [timer.site.SiteInfo, timer.site.SiteInfo][]) => void) {
        const storageListener = (
            changes: { [key: string]: chrome.storage.StorageChange },
            _areaName: "sync" | "local" | "managed"
        ) => {
            const changedSites: [timer.site.SiteInfo, timer.site.SiteInfo][] = Object.entries(changes)
                .filter(([k]) => k.startsWith(DB_KEY_PREFIX))
                .map(([k, v]) => {
                    const siteKey = cvt2SiteKey(k)
                    const oldVal = cvt2SiteInfo(siteKey, v?.oldValue as _Entry)
                    const newVal = cvt2SiteInfo(siteKey, v?.newValue as _Entry)
                    return [oldVal, newVal]
                })
            changedSites.length && listener?.(changedSites)
        }
        chrome.storage.onChanged.addListener(storageListener)
    }
}

export default SiteDatabase