/**
 * Copyright (c) 2025 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import optionHolder from "@service/components/option-holder"
import { exportJson } from "@util/file"
import { deserialize } from "@util/file"
import { defaultOption } from "@util/constant/option"

export interface ExportedSettings {
    version: string
    timestamp: number
    settings: timer.option.AllOption
}

/**
 * Export all settings to JSON file
 */
export async function exportSettings(): Promise<void> {
    const settings = await optionHolder.get()
    const exportData: ExportedSettings = {
        version: '1.0',
        timestamp: Date.now(),
        settings
    }

    const fileName = `timer-settings-${new Date().toISOString().split('T')[0]}`
    exportJson(exportData, fileName)
}

/**
 * Import settings from JSON file
 */
export async function importSettings(jsonString: string): Promise<void> {
    const importData = deserialize(jsonString) as ExportedSettings

    if (!importData || !importData.settings) {
        throw new Error('Invalid settings file format')
    }

    // Validate the imported settings structure
    const validatedSettings = await validateAndMergeSettings(importData.settings)

    // Set the imported settings
    await optionHolder.set(validatedSettings)
}

/**
 * Validate imported settings and merge with defaults to ensure all required fields exist
 */
async function validateAndMergeSettings(importedSettings: Partial<timer.option.AllOption>): Promise<timer.option.AllOption> {
    // Get current user settings as defaults instead of default options
    const defaults = await optionHolder.get()

    // Merge imported settings with defaults, giving preference to imported values
    const mergedSettings: timer.option.AllOption = {
        ...defaults,
        ...importedSettings
    }

    // Ensure critical nested objects exist
    if (importedSettings.backupAuths) {
        mergedSettings.backupAuths = { ...defaults.backupAuths, ...importedSettings.backupAuths }
    }

    if (importedSettings.backupLogin) {
        mergedSettings.backupLogin = { ...defaults.backupLogin, ...importedSettings.backupLogin }
    }

    if (importedSettings.backupExts) {
        mergedSettings.backupExts = { ...defaults.backupExts, ...importedSettings.backupExts }
    }

    return mergedSettings
}

/**
 * Create a file input element to select JSON file for import
 */
export function createFileInput(): Promise<string> {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.style.display = 'none'

        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0]
            if (!file) {
                reject(new Error('No file selected'))
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                resolve(content)
            }
            reader.onerror = () => reject(new Error('Failed to read file'))
            reader.readAsText(file)
        }

        input.oncancel = () => reject(new Error('File selection cancelled'))

        document.body.appendChild(input)
        input.click()
        document.body.removeChild(input)
    })
}
