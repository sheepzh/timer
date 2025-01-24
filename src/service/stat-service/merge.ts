/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MergeRuleDatabase from "@db/merge-rule-database"
import CustomizedHostMergeRuler from "@service/components/host-merge-ruler"
import { CATE_NOT_SET_ID, identifySiteKey } from "@util/site"

const storage = chrome.storage.local

const mergeRuleDatabase = new MergeRuleDatabase(storage)

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
    origin.forEach(ele => {
        const { date, siteKey, cateKey, iconUrl, alias, cateId } = ele || {}
        const key = [identifySiteKey(siteKey), cateKey?.toString?.() ?? ''].join('_')
        let exist = map[key]
        if (!exist) {
            exist = map[key] = {
                siteKey, cateKey,
                iconUrl, alias, cateId,
                focus: 0,
                time: 0,
                mergedRows: [],
                mergedDates: [],
                composition: { focus: [], time: [] },
            }
        }
        mergeResult(exist, ele)
        if (ele.siteKey?.type === 'merged') {
            exist.mergedRows.push(...ele.mergedRows ?? [])
        }
        exist.mergedDates.push(date)
    })
    const newRows = Object.values(map)
    return newRows
}

export async function mergeHost(origin: timer.stat.Row[]): Promise<timer.stat.Row[]> {
    const map: Record<string, timer.stat.Row> = {}

    // Generate ruler
    const mergeRuleItems: timer.merge.Rule[] = await mergeRuleDatabase.selectAll()
    const mergeRuler = new CustomizedHostMergeRuler(mergeRuleItems)

    origin.forEach(ele => {
        const { siteKey, date } = ele || {}
        const { host, type } = siteKey || {}
        if (type !== 'normal') return
        let mergedHost = mergeRuler.merge(host)
        const key = (date ?? '') + mergedHost
        let exist = map[key]
        if (!exist) {
            exist = map[key] = {
                siteKey: { type: 'merged', host: mergedHost },
                date,
                focus: 0,
                time: 0,
                mergedRows: [],
                composition: { focus: [], time: [] },
            } satisfies timer.stat.Row
        }
        mergeResult(exist, ele)
        exist.mergedRows.push(ele)
    })
    return Object.values(map)
}

export async function mergeCate(origin: timer.stat.Row[]): Promise<timer.stat.Row[]> {
    const rowMap: Record<string, timer.stat.Row> = {}
    origin?.forEach(ele => {
        let { siteKey, date, cateId } = ele || {}
        if (siteKey?.type !== 'normal') return

        cateId = cateId ?? CATE_NOT_SET_ID
        const key = (date ?? '') + cateId.toString()
        let exist = rowMap[key]
        if (!exist) {
            exist = rowMap[key] = {
                cateKey: cateId, date,
                focus: 0,
                time: 0,
                mergedRows: [],
                composition: { focus: [], time: [] },
            } satisfies timer.stat.Row
        }
        mergeResult(exist, ele)
        exist.mergedRows.push(ele)
    })
    return Object.values(rowMap)
}

function mergeResult(target: timer.stat.Row, delta: timer.stat.Row) {
    const { focus, time, composition } = delta || {}
    target.focus += focus ?? 0
    target.time += time ?? 0
    target.composition = mergeComposition(target.composition, composition)
}