/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Processor for version
 *  
 * @since 0.1.2
 */
export default interface IVersionProcessor {
    /**
     * The version number of this processor
     */
    since(): string

    /**
     * Initialize
     * 
     * @param reason reason of chrome OnInstalled event
     */
    process(reason: string): void
}