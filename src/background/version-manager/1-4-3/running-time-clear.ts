import TimerDatabase from "@db/timer-database"
import { isNotZeroResult } from "@util/stat"

const db = new TimerDatabase(chrome.storage.local)

/**
 * Clear the running time
 * 
 * @since 1.4.3
 */
export default class RunningTimeClear implements VersionProcessor {

    since(): string {
        return "1.4.3"
    }

    async process(reason: chrome.runtime.OnInstalledReason): Promise<void> {
        // Only trigger when updating
        if (reason !== 'update') {
            return
        }
        const allRows = await db.select()
        const rows2Delete: timer.stat.Row[] = []
        let updatedCount = 0
        for (const row of allRows) {
            if (isNotZeroResult(row)) {
                // force update
                await db.forceUpdate(row)
                updatedCount++
            } else {
                // delete it
                rows2Delete.push(row)
            }
        }
        await db.delete(rows2Delete)
        console.log(`Updated ${updatedCount} rows, deleted ${rows2Delete.length} rows`)
    }
}