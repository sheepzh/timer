
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
export function openLog() {
    OPEN_LOG = true
}