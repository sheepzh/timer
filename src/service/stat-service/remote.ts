/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { type StatCondition } from "@db/stat-database"
import processor from "@service/backup/processor"
import { identifyStatKey } from "@util/stat"
import { getBirthday } from "@util/time"
import { cvt2StatRow } from "./common"

export async function processRemote(param: StatCondition, origin: timer.stat.Row[]): Promise<timer.stat.Row[]> {
    if (!await canReadRemote()) {
        return origin
    }
    // Map to merge
    const originMap: Record<string, MakeRequired<timer.stat.Row, 'composition'>> = {}
    origin.forEach(row => originMap[identifyStatKey(row)] = {
        ...row,
        composition: {
            focus: [row.focus],
            time: [row.time],
            run: row.run ? [row.run] : [],
        }
    })
    // Predicate with host
    const { host, fullHost } = param
    const predicate: (row: timer.core.Row) => boolean = host
        // With host condition
        ? fullHost
            // Full match
            ? r => r.host === host
            // Fuzzy match
            : r => !!r.host && r.host.includes(host)
        // Without host condition
        : _r => true
    // 1. query remote
    let start: Date | undefined = undefined, end: Date | undefined = undefined
    if (param.date instanceof Array) {
        start = param.date?.[0]
        end = param.date?.[1]
    } else {
        start = param.date
    }
    start = start || getBirthday()
    end = end || new Date()
    const remote = await processor.query({ excludeLocal: true, start, end })
    remote.filter(predicate).forEach(row => processRemoteRow(originMap, row))
    return Object.values(originMap)
}

/**
 * Enabled to read remote backup data
 *
 * @since 1.2.0
 * @returns T/F
 */
export async function canReadRemote(): Promise<boolean> {
    const { errorMsg } = await processor.checkAuth()
    return !errorMsg
}

function processRemoteRow(rowMap: Record<string, MakeRequired<timer.stat.Row, 'composition'>>, remoteBase: timer.core.Row) {
    const row = cvt2StatRow(remoteBase)
    const key = identifyStatKey(row)
    let exist = rowMap[key]
    !exist && (exist = rowMap[key] = {
        date: row.date,
        siteKey: row.siteKey,
        time: 0,
        focus: 0,
        composition: {
            focus: [],
            time: [],
            run: [],
        },
    } satisfies MakeRequired<timer.stat.Row, 'composition'>)

    const { focus = 0, time = 0, run = 0, cid = '', cname } = row

    exist.focus += focus
    exist.time += time
    run && (exist.run = run)
    focus && exist.composition.focus.push({ cid, cname, value: focus })
    time && exist.composition.time.push({ cid, cname, value: time })
    run && exist.composition.run.push({ cid, cname, value: run })
}