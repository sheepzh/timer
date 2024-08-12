/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import resource from './option-resource.json'

export type OptionMessage = {
    yes: string
    no: string
    popup: {
        title: string
        max: string
        defaultMergeDomain: string
        defaultDisplay: string
        displaySiteName: string
    }
    appearance: {
        title: string
        // whitelist
        displayWhitelist: string
        whitelistItem: string
        contextMenu: string
        // badge text
        displayBadgeText: string
        badgeBgColor: string
        icon: string
        badgeTextContent: string
        locale: {
            label: string
            default: string
            changeConfirm: string
            reloadButton: string
        }
        printInConsole: {
            label: string
            console: string
            info: string
        },
        darkMode: {
            label: string
            options: Record<timer.option.DarkMode, string>
        }
    }
    statistics: {
        title: string
        countLocalFiles: string
        localFileTime: string
        localFilesInfo: string
        collectSiteName: string
        siteNameUsage: string
        siteName: string
        fileAccessDisabled: string
        fileAccessFirefox: string
        weekStart: string
        weekStartAsNormal: string
    }
    dailyLimit: {
        prompt: string
        level: {
            [level in timer.limit.RestrictionLevel]: string
        } & {
            label: string
            passwordLabel: string
            verificationLabel: string
            verificationDifficulty: {
                [diff in timer.limit.VerificationDifficulty]: string
            }
            strictTitle: string
            strictContent: string
        }
    }
    backup: {
        title: string
        type: string
        client: string
        meta: {
            [type in timer.backup.Type]: {
                label?: string
                authInfo?: string
            }
        } & {
            [type in Extract<timer.backup.Type, "obsidian_local_rest_api">]: {
                endpointLabel: string
                endpointInfo: string
                pathLabel: string
            }
        }
        alert: string
        operation: string
        clientTable: {
            selectTip: string
            dataRange: string
            notSelected: string
            current: string
        }
        download: {
            btn: string
            step2: string
            willDownload: string
            confirmTip: string
        }
        clear: {
            btn: string
            confirmTip: string
        }
        lastTimeTip: string
        auto: {
            label: string
            interval: string
        }
    }
    resetButton: string
    resetSuccess: string
    defaultValue: string
}

const _default: Messages<OptionMessage> = resource

export default _default