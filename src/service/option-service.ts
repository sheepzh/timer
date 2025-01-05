/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import OptionDatabase from "@db/option-database"
import { defaultOption } from "@util/constant/option"

const db = new OptionDatabase(chrome.storage.local)

function migrateOld(result: timer.option.AllOption): timer.option.AllOption {
    if (!result) return result
    const newRes = { ...result }
    const duration = newRes['defaultDuration']
    if (duration as string === 'last30Days') {
        // old option, deprecated since v2.5.3, Nov 23 2024
        newRes.defaultDuration = 'lastDays'
        newRes.defaultDurationNum = 30
    }
    return newRes
}

async function getAllOption(): Promise<timer.option.AllOption> {
    const exist: Partial<timer.option.AllOption> = await db.getOption()
    const result: timer.option.AllOption = defaultOption()
    Object.entries(exist).forEach(([key, val]) => result[key] = val)
    return migrateOld(result)
}

async function setLocale(locale: timer.option.LocaleOption): Promise<void> {
    const exist: Partial<timer.option.AllOption> = await db.getOption() || {}
    exist.locale = locale
    await setOption(exist)
}

async function setBackupOption(option: Partial<timer.option.BackupOption>): Promise<void> {
    // Rewrite auths
    const existOption = await getAllOption()
    const existAuths = existOption.backupAuths || {}
    const existExts = existOption.backupExts || {}
    Object.entries(option.backupAuths || {}).forEach(([type, auth]) => existAuths[type] = auth)
    Object.entries(option.backupExts || {}).forEach(([type, ext]) => {
        if (!ext) return
        const existExt = existExts[type] || {}
        Object.entries(ext).forEach(([key, val]) => existExt[key] = val)
        existExts[type] = existExt
    })
    option.backupAuths = existAuths
    option.backupExts = existExts
    await setOption(option)
}

async function setOption(option: Partial<timer.option.AllOption>): Promise<void> {
    const exist: Partial<timer.option.AllOption> = await db.getOption()
    const toSet = defaultOption()
    Object.entries(exist).forEach(([key, val]) => toSet[key] = val)
    Object.entries(option).forEach(([key, val]) => toSet[key] = val)
    await db.setOption(toSet)
}

async function isDarkMode(targetVal?: timer.option.AppearanceOption): Promise<boolean> {
    const option = targetVal || await getAllOption()
    const darkMode = option.darkMode
    if (darkMode === "default") {
        if (typeof window === 'undefined') return false
        return !!window.matchMedia('(prefers-color-scheme: dark)')?.matches
    } else if (darkMode === "on") {
        return true
    } else if (darkMode === "off") {
        return false
    } else if (darkMode === "timed") {
        const start = option.darkModeTimeStart
        const end = option.darkModeTimeEnd
        if (start === undefined || end === undefined) {
            return false
        }
        const now = new Date()
        const currentSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
        if (start > end) {
            // Mostly
            return start <= currentSecs || currentSecs <= end
        } else if (start < end) {
            return start <= currentSecs && currentSecs <= end
        } else {
            return currentSecs === start
        }
    }
    return false
}

async function setDarkMode(mode: timer.option.DarkMode, period?: [number, number]): Promise<void> {
    const exist = await getAllOption()
    exist.darkMode = mode
    if (mode === 'timed') {
        const [start, end] = period || []
        exist.darkModeTimeStart = start
        exist.darkModeTimeEnd = end
    }
    await db.setOption(exist)
}

class OptionService {
    getAllOption = getAllOption
    setPopupOption = setOption
    setAppearanceOption = setOption
    setAccessibilityOption = setOption
    setStatisticsOption = setOption
    /**
     * @since 1.9.0
     */
    setDailyLimitOption = setOption
    /**
     * @since 1.2.0
     */
    setBackupOption = setBackupOption
    /**
     * @since 3.0.0
     */
    setLocale = setLocale
    addOptionChangeListener = db.addOptionChangeListener
    /**
     * @since 1.1.0
     */
    isDarkMode = isDarkMode
    /**
     * @since 3.0.0
     */
    setDarkMode = setDarkMode
}

export default new OptionService()
