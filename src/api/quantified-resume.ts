import { fetchGet, fetchPost } from "./http"

const QR_BUILTIN_TYPE = "BrowserTime"
export const DEFAULT_ENDPOINT = "http://localhost:12233"

export type BucketPayload = Pick<timer.backup.Client, 'name' | 'minDate' | 'maxDate'>

export type Bucket = {
    id?: number
    no?: number
    name: string
    builtin: "BrowserTime"
    builtinRefId: string
    status?: "Enabled" | "Disabled"
    desc?: string
    created?: number
    lastModified?: number
    payload?: BucketPayload
}

export type QrRequestContext = {
    endpoint?: string
}

export const listBuckets = async (ctx: QrRequestContext, clientId?: string): Promise<Bucket[]> => {
    const response = await fetchGet(`${ctx?.endpoint || DEFAULT_ENDPOINT}/api/0/bucket?bt=${QR_BUILTIN_TYPE}&bt_rid=${clientId || ''}`)
    const status = response?.status
    if (status === 200) {
        return await response.json()
    } else if (status === 422) {
        throw new Error("Failed to connect Quantified Resume, please contact the developer")
    } else {
        console.error(response)
        throw new Error("Unexpected status code: " + status)
    }
}

export const createBucket = async (ctx: QrRequestContext, bucket: Bucket): Promise<number> => {
    const response = await fetchPost(`${ctx?.endpoint || DEFAULT_ENDPOINT}/api/0/bucket`, bucket)
    const status = response?.status
    if (status === 200) {
        return await response.json()
    } else if (status === 422) {
        throw new Error("Failed to connect Quantified Resume, please contact the developer")
    } else {
        console.error(response)
        throw new Error("Unexpected status code: " + status)
    }
}