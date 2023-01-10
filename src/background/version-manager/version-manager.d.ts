/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Processor for version
 *  
 * @since 0.1.2
 */
declare type VersionProcessor = {
    /**
     * The version number of this processor
     */
    since(): string

    /**
     * Initialize
     * 
     * @param reason reason of chrome OnInstalled event
     */
    process(reason: chrome.runtime.OnInstalledReason): void
}