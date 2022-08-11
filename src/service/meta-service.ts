/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MetaDatabase from "@db/meta-database"

const storage = chrome.storage.local
const db: MetaDatabase = new MetaDatabase(storage)

async function getInstallTime() {
    const meta: timer.meta.ExtensionMeta = await db.getMeta()
    return meta && meta.installTime ? new Date(meta.installTime) : undefined
}

async function updateInstallTime(installTime: Date) {
    const meta: timer.meta.ExtensionMeta = await db.getMeta()
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

async function getCid(): Promise<string> {
    const meta: timer.meta.ExtensionMeta = await db.getMeta()
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
}

export default new MetaService()