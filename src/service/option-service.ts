/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import optionHolder from "./components/option-holder"

async function setLocale(locale: timer.option.LocaleOption): Promise<void> {
    const exist: Partial<timer.option.AllOption> = await optionHolder.get()
    exist.locale = locale
    await optionHolder.set(exist)
}

async function setBackupOption(option: Partial<timer.option.BackupOption>): Promise<void> {
    // Rewrite auths
    const existOption = await optionHolder.get()
    const existAuths = existOption.backupAuths || {}
    const existExts = existOption.backupExts || {}
    Object.entries(option.backupAuths || {}).forEach(([key, auth]) => existAuths[key as timer.backup.Type] = auth)
    Object.entries(option.backupExts || {}).forEach(([key, ext]) => {
        if (!ext) return
        const type = key as timer.backup.Type
        const existExt = existExts[type] || {}
        Object.entries(ext).forEach(([extKey, val]) => existExt[extKey as keyof timer.backup.TypeExt] = val)
        existExts[type] = existExt
    })
    option.backupAuths = existAuths
    option.backupExts = existExts
    await optionHolder.set(option)
}

async function isDarkMode(targetVal?: timer.option.AppearanceOption): Promise<boolean> {
    const option = targetVal || await optionHolder.get()
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
    const exist: timer.option.AllOption = await optionHolder.get()
    exist.darkMode = mode
    if (mode === 'timed') {
        const [start, end] = period || []
        exist.darkModeTimeStart = start
        exist.darkModeTimeEnd = end
    }
    await optionHolder.set(exist)
}

class OptionService {
    /**
     * @since 1.2.0
     */
    setBackupOption = setBackupOption
    /**
     * @since 3.0.0
     */
    setLocale = setLocale
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
