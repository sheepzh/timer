/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MergeRuleDatabase from "@db/merge-rule-database"
import CustomizedHostMergeRuler from "@service/components/host-merge-ruler"

const storage = chrome.storage.local

const mergeRuleDatabase = new MergeRuleDatabase(storage)

function merge(map: Record<string, timer.stat.Row>, origin: timer.stat.Row, key: string): timer.stat.Row {
    let exist: timer.stat.Row = map[key]
    !exist && (exist = map[key] = {
        ...origin,
        focus: 0,
        time: 0,
        mergedHosts: [],
        composition: { focus: [], time: [] },
        virtual: false,
    })

    exist.time += origin.time
    exist.focus += origin.focus
    exist.composition = mergeComposition(exist.composition, origin.composition)

    origin.mergedHosts && origin.mergedHosts.forEach(originHost =>
        !exist.mergedHosts.find(existOrigin => existOrigin.host === originHost.host) && exist.mergedHosts.push(originHost)
    )
    return exist
}

type _RemoteCompositionMap = Record<'_' | string, timer.stat.RemoteCompositionVal>

function mergeComposition(c1: timer.stat.RemoteComposition, c2: timer.stat.RemoteComposition): timer.stat.RemoteComposition {
    const focusMap: _RemoteCompositionMap = {}
    const timeMap: _RemoteCompositionMap = {}
    c1?.focus?.forEach(e => accCompositionValue(focusMap, e))
    c2?.focus?.forEach(e => accCompositionValue(focusMap, e))
    c1?.time?.forEach(e => accCompositionValue(timeMap, e))
    c2?.time?.forEach(e => accCompositionValue(timeMap, e))

    const result = {
        focus: Object.values(focusMap),
        time: Object.values(timeMap),
    }
    return result
}

function accCompositionValue(map: _RemoteCompositionMap, value: timer.stat.RemoteCompositionVal) {
    if (typeof value === 'number') {
        const cid = '_'
        const existVal = map[cid]
        if (!existVal || typeof existVal !== 'number') {
            map[cid] = value
        } else {
            map[cid] = existVal + value
        }
    } else {
        const cid = value.cid
        const existVal = map[cid]
        if (!existVal || typeof existVal === 'number') {
            map[cid] = value
        } else {
            existVal.value = existVal.value + value.value
        }
    }
}

export function mergeDate(origin: timer.stat.Row[]): timer.stat.Row[] {
    const map: Record<string, timer.stat.Row> = {}
    origin.forEach(o => {
        let merged = merge(map, o, o.host)
        merged.date = null
        let mergedDates = merged.mergedDates || []
        mergedDates.push(o.date)
        merged.mergedDates = mergedDates
    })
    const newRows = Object.values(map)
    return newRows
}

export async function mergeHost(origin: timer.stat.Row[]): Promise<timer.stat.Row[]> {
    const newRows = []
    const map = {}

    // Generate ruler
    const mergeRuleItems: timer.merge.Rule[] = await mergeRuleDatabase.selectAll()
    const mergeRuler = new CustomizedHostMergeRuler(mergeRuleItems)

    origin.forEach(o => {
        const host = o.host
        const date = o.date
        let mergedHost = mergeRuler.merge(host)
        const merged = merge(map, o, mergedHost + date)
        merged.host = mergedHost
        const mergedHosts = merged.mergedHosts || (merged.mergedHosts = [])
        mergedHosts.push(o)
    })
    for (let key in map) {
        newRows.push(map[key])
    }
    return newRows
}