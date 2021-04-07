import { use } from "vue/types/umd"
import { getUsedStorage } from "../database/memory-detector"

let OPEN_LOG = false

/**
 * @since 0.0.4
 * @param args arguments
 */
export function log(...args: any) {
    OPEN_LOG && console.log(args)
}

/**
 * @since 0.0.4
 */
export function openLog(): string {
    OPEN_LOG = true
    return 'Opened the log manually.'
}

/**
 * @since 0.0.8
 */
export function closeLog(): string {
    OPEN_LOG = false
    return 'Closed the log manually.'
}

/**
 * Show the memory info
 * 
 * @since 0.0.9
 */
export function showMemory() {
    getUsedStorage((used, total) => {
        console.log(`\t${used} / ${total} = ${Math.round(used * 100.0 / total * 100) / 100}%`)
    })
    return 'Memory used:'
}

/**
 * @since 0.0.8
 */
export default { openLog, closeLog, showMemory }