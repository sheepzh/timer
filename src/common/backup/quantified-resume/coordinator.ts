import { batchCreateItems, Bucket, createBucket, Item, listAllItems, listBuckets, removeBucket, updateBucket } from "@api/quantified-resume"
import metaMessages, { } from "@i18n/message/common/meta"
import { t } from "@i18n"
import { groupBy } from "@util/array"
import { formatTimeYMD, parseTime } from "@util/time"

export type QuantifiedResumeCache = {
    bucketIds: {
        // clientId => bucketId
        [clientId: string]: number
    }
}

async function createNewBucket(context: timer.backup.CoordinatorContext<QuantifiedResumeCache>): Promise<number> {
    const { cid, cname } = context || {}
    const { endpoint } = context?.ext || {}
    const appName = t(metaMessages, { key: msg => msg.name })
    const bucket: Bucket = {
        name: `${appName}: ${cid}`,
        builtin: "BrowserTime",
        builtinRefId: cid,
        payload: { name: cname }
    }
    return createBucket({ endpoint }, bucket)
}

async function getBucketId(context: timer.backup.CoordinatorContext<QuantifiedResumeCache>, specificCid?: string): Promise<number> {
    const cid = specificCid || context?.cid
    const { cache } = context || {}
    // 1. query from cache
    let bucketId = cache?.bucketIds?.[cid]
    if (bucketId) return bucketId

    const { endpoint } = context?.ext || {}
    // 2. query again
    bucketId = (await listBuckets({ endpoint }, cid))?.filter(b => b.builtinRefId === cid)?.[0]?.id
    if (!bucketId) {
        // 3. create one
        bucketId = await createNewBucket(context)
    }
    return bucketId
}

export default class QuantifiedResumeCoordinator implements timer.backup.Coordinator<QuantifiedResumeCache> {
    async updateClients(context: timer.backup.CoordinatorContext<QuantifiedResumeCache>, clients: timer.backup.Client[]): Promise<void> {
        const { endpoint } = context?.ext || {}
        const existBuckets = groupBy(await listBuckets({ endpoint }) || [], b => b.builtinRefId, l => l?.[0])
        if (!clients?.length) return
        const promises = Promise.all(clients.map(
            async ({ id, name, minDate, maxDate }) => {
                const exist = existBuckets[id]
                if (exist) {
                    // update payload
                    exist.payload = { name, minDate, maxDate }
                    await updateBucket({ endpoint }, exist)
                } else {
                    await createNewBucket(context)
                }
            })
        )
        await promises
    }

    async listAllClients(context: timer.backup.CoordinatorContext<QuantifiedResumeCache>): Promise<timer.backup.Client[]> {
        const { endpoint } = context?.ext || {}
        const buckets = await listBuckets({ endpoint })

        let result: timer.backup.Client[] = []
        let bucketIds: { [clientId: string]: number } = {}
        buckets?.forEach(({ payload, id: bucketId, builtinRefId, name: bucketName }) => {
            let { name, minDate, maxDate } = payload || {}
            const client: timer.backup.Client = {
                id: builtinRefId,
                name: name || bucketName,
                minDate, maxDate,
            }
            result.push(client)
            bucketIds[builtinRefId] = bucketId
        })

        context.cache = { ...(context.cache || {}), bucketIds }
        await context.handleCacheChanged()

        return result
    }

    async download(context: timer.backup.CoordinatorContext<QuantifiedResumeCache>, dateStart: Date, dateEnd: Date, targetCid?: string): Promise<timer.stat.RowBase[]> {
        let bucketId = await getBucketId(context, targetCid)
        if (!bucketId) return []
        const items = await listAllItems({ endpoint: context?.ext?.endpoint }, bucketId)
        return items?.map(({ name, timestamp, metrics }) => ({
            host: name,
            date: formatTimeYMD(timestamp),
            focus: metrics?.focus,
            time: metrics?.visit,
        } satisfies timer.stat.RowBase)) || []
    }

    async upload(context: timer.backup.CoordinatorContext<QuantifiedResumeCache>, rows: timer.stat.RowBase[]): Promise<void> {
        if (!rows?.length) return

        const bucketId = await getBucketId(context)
        let items = rows.map(({ host, date, focus, time: visit }) => {
            const time = parseTime(date)
            time.setHours(0)
            time.setMinutes(0)
            time.setSeconds(0)
            time.setMilliseconds(0)
            const item: Item = {
                refId: `${date}${host}`,
                timestamp: time.getTime(),
                metrics: { visit, focus },
                action: "web_time",
                name: host,
                payload: { date, host, cid: context.cid },
            }
            return item
        })
        const groups = groupBy(items, (_, idx) => Math.floor(idx / 2000), l => l)

        const { endpoint } = context?.ext || {}
        for (const group of Object.values(groups)) {
            await batchCreateItems({ endpoint }, bucketId, group)
        }
    }

    async testAuth(_auth: timer.backup.Auth, ext: timer.backup.TypeExt): Promise<string> {
        try {
            const { endpoint } = ext || {}
            await listBuckets({ endpoint })
        } catch (e) {
            return (e as Error)?.message || e || 'Unknown error'
        }
    }

    async clear(context: timer.backup.CoordinatorContext<QuantifiedResumeCache>, client: timer.backup.Client): Promise<void> {
        const bucketId = await getBucketId(context, client.id)
        if (!bucketId) return
        await removeBucket({ endpoint: context?.ext?.endpoint }, bucketId)
    }
}