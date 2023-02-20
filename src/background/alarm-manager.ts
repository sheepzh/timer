import { clearAlarm, createAlarm, onAlarm } from "@api/chrome/alarm"
import { getRuntimeId } from "@api/chrome/runtime"

type _AlarmConfig = {
    handler: _Handler,
    interval: number,
}

type _Handler = (alarm: ChromeAlarm) => void

const ALARM_PREFIX = 'timer-alarm-' + getRuntimeId() + '-'
const ALARM_PREFIX_LENGTH = ALARM_PREFIX.length

const getInnerName = (outerName: string) => ALARM_PREFIX + outerName
const getOuterName = (innerName: string) => innerName.substring(ALARM_PREFIX_LENGTH)

/**
 * The manager of alarms
 * 
 * @since 1.4.6
 */
class AlarmManager {
    private alarms: Record<string, _AlarmConfig> = {}

    constructor() {
        this.init()
    }

    private init() {
        onAlarm(async alarm => {
            const name = alarm.name
            if (!name.startsWith(ALARM_PREFIX)) {
                // Unknown alarm
                return
            }
            const innerName = getOuterName(name)
            const config: _AlarmConfig = this.alarms[innerName]
            if (!config) {
                // Not registered, or removed
                return
            }
            // Handle alarm event
            config.handler?.(alarm)
            const nextTs = Date.now() + config.interval
            // Clear this one
            await clearAlarm(name)
            createAlarm(name, nextTs)
        })
    }

    /**
     * Set a alarm to do sth with interval
     */
    setInterval(outerName: string, interval: number, handler: _Handler): void {
        if (!interval || !handler) {
            return
        }
        const config: _AlarmConfig = { handler, interval }
        if (this.alarms[outerName]) {
            // Existed, only update the config
            this.alarms[outerName] = config
            return
        }
        // Initialize config
        this.alarms[outerName] = config
        // Create new one alarm
        createAlarm(getInnerName(outerName), Date.now() + interval)
    }

    /**
     * Remove a interval
     */
    remove(outerName: string) {
        delete this.alarms[outerName]
        clearAlarm(getInnerName(outerName))
    }
}

export default new AlarmManager()