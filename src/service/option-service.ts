/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import OptionDatabase from "@db/option-database"
import { defaultAppearance, defaultPopup, defaultStatistics } from "@util/constant/option"

const db = new OptionDatabase(chrome.storage.local)

const defaultOption = () => {
    return { ...defaultAppearance(), ...defaultPopup(), ...defaultStatistics() }
}

async function getAllOption(): Promise<timer.option.AllOption> {
    const exist: Partial<timer.option.AllOption> = await db.getOption()
    const result: timer.option.AllOption = defaultOption()
    Object.entries(exist).forEach(([key, val]) => result[key] = val)
    return result
}

async function setPopupOption(option: timer.option.PopupOption): Promise<void> {
    await setOption(option)
}

async function setAppearanceOption(option: timer.option.AppearanceOption): Promise<void> {
    await setOption(option)
}

async function setStatisticsOption(option: timer.option.StatisticsOption): Promise<void> {
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
    if (darkMode === "on") {
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

class OptionService {
    getAllOption = getAllOption
    setPopupOption = setPopupOption
    setAppearanceOption = setAppearanceOption
    setStatisticsOption = setStatisticsOption
    addOptionChangeListener = db.addOptionChangeListener
    /**
     * @since 1.1.0
     */
    isDarkMode = isDarkMode
}

export default new OptionService()