/**
 * @since 2.1.7
 */
export const deepCopy = <T = any>(obj: T): T => {
    if (obj === null) return null
    if (typeof obj !== 'object') return obj

    let deep = {}
    Object.entries(obj).forEach(([k, v]) => {
        if (typeof v !== "object" || v === null) {
            deep[k] = v
        } else if (Array.isArray(v)) {
            deep[k] = v.map(e => deepCopy(e))
        } else if (v instanceof Set) {
            deep[k] = new Set(v)
        } else if (v instanceof Map) {
            deep[k] = new Map(v)
        } else if (v instanceof Date) {
            deep[k] = new Date(v.getTime())
        } else {
            // Ignored type
            deep[k] = deepCopy(v)
        }
    })
    return deep as T
}