type _AlarmConfig = {
    handler: _Handler,
    interval: number,
}

type _Handler = (alarm: chrome.alarms.Alarm) => void

const ALARM_PREFIX = 'timer-alarm-' + chrome.runtime.id + '-'
const ALARM_PREFIX_LENGTH = ALARM_PREFIX.length

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
        chrome.alarms.onAlarm.addListener(alarm => {
            const name = alarm.name
            if (!name.startsWith(ALARM_PREFIX)) {
                // Unknown alarm
                return
            }
            const realName = name.substring(ALARM_PREFIX_LENGTH)
            const config: _AlarmConfig = this.alarms[realName]
            if (!config) {
                // Not register, or unregistered
                return
            }
            // Handle alarm event
            config.handler?.(alarm)
            // Clear this one
            chrome.alarms.clear(name)
            // Create new one
            chrome.alarms.create(name, { when: Date.now() + config.interval })
        })
    }

    setInterval(name: string, interval: number, handler: _Handler): void {
        if (!interval || !handler) {
            return
        }
        const config: _AlarmConfig = { handler, interval }
        if (this.alarms[name]) {
            // Existed, only update the config
            this.alarms[name] = config
            return
        }
        // Initialize config
        this.alarms[name] = config
        // Create new one alarm
        chrome.alarms.create(ALARM_PREFIX + name, { when: Date.now() + interval })
    }
}

export default new AlarmManager()