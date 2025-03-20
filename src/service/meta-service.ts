/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MetaDatabase from "@db/meta-database"
import { REVIEW_PAGE } from "@util/constant/url"
import { getDayLength } from "@util/time"

const storage = chrome.storage.local
const db: MetaDatabase = new MetaDatabase(storage)

async function getInstallTime() {
    const meta: timer.ExtensionMeta = await db.getMeta()
    return meta && meta.installTime ? new Date(meta.installTime) : undefined
}

async function updateInstallTime(installTime: Date) {
    const meta: timer.ExtensionMeta = await db.getMeta()
    if (meta?.installTime) {
        // Must not rewrite
        return
    }
    meta.installTime = installTime.getTime()
    await db.update(meta)
}

function increaseApp(routePath: string): void {
    db.getMeta().then(meta => {
        const appCounter = meta.appCounter || {}
        appCounter[routePath] = (appCounter[routePath] || 0) + 1
        meta.appCounter = appCounter
        db.update(meta)
    })
}

function increasePopup(): void {
    db.getMeta().then(meta => {
        const popupCounter = meta.popupCounter || {}
        popupCounter._total = (popupCounter._total || 0) + 1
        meta.popupCounter = popupCounter
        db.update(meta)
    })
}

async function getCid(): Promise<string | undefined> {
    const meta: timer.ExtensionMeta = await db.getMeta()
    return meta?.cid
}

async function updateCid(newCid: string) {
    const meta = await db.getMeta()
    if (meta.cid) {
        return
    }
    meta.cid = newCid
    await db.update(meta)
}

async function updateBackUpTime(type: timer.backup.Type, time: number) {
    const meta = await db.getMeta()
    if (!meta.backup) {
        meta.backup = {}
    }
    meta.backup[type] = { ts: time }
    await db.update(meta)
}

async function getLastBackUp(type: timer.backup.Type): Promise<{ ts: number, msg?: string } | undefined> {
    const meta = await db.getMeta()
    return meta?.backup?.[type]
}

async function saveFlag(flag: timer.ExtensionMetaFlag) {
    if (!flag) return
    const meta = await db.getMeta()
    if (!meta.flag) meta.flag = {}
    meta.flag[flag] = true
    await db.update(meta)
}

async function getFlag(flag: timer.ExtensionMetaFlag) {
    if (!flag) return false
    const meta = await db.getMeta()
    return !!meta?.flag?.[flag]
}

const INSTALL_DAY_MIN_LIMIT = 14

class MetaService {
    getInstallTime = getInstallTime
    updateInstallTime = updateInstallTime
    /**
     * @since 1.2.0
     */
    getCid = getCid
    /**
     * @since 1.2.0
     */
    updateCid = updateCid
    increaseApp = increaseApp
    increasePopup = increasePopup
    /**
     * @since 1.4.7
     */
    updateBackUpTime = updateBackUpTime
    /**
     * @since 1.4.7
     */
    getLastBackUp = getLastBackUp
    /**
     * @since 2.2.0
     */
    saveFlag = saveFlag

    async recommendRate(): Promise<boolean> {
        if (!REVIEW_PAGE) return false
        const installTime = await getInstallTime()
        if (!installTime) return false
        const installedDays = getDayLength(installTime, new Date())
        if (installedDays < INSTALL_DAY_MIN_LIMIT) return false
        const rateOpen = await getFlag("rateOpen")
        return !rateOpen
    }
}

export default new MetaService()
