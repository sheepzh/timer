/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import optionService from "@service/option-service"
import alarmManager from "./alarm-manager"
import processor from "@src/common/backup/processor"
import { MILL_PER_MINUTE } from "@util/time"

const ALARM_NAME = 'auto-backup-data'

class BackupScheduler {
    needBackup = false
    /**
     * Interval of milliseconds
     */
    interval: number = 0

    init() {
        optionService.getAllOption().then(opt => this.handleOption(opt))
        optionService.addOptionChangeListener(opt => this.handleOption(opt))
    }

    private handleOption(option: timer.option.BackupOption) {
        const { autoBackUp, backupType, autoBackUpInterval = 0 } = option || {}
        this.needBackup = backupType !== "none" && !!backupType && !!autoBackUp
        this.interval = autoBackUpInterval * MILL_PER_MINUTE
        if (this.needSchedule()) {
            alarmManager.setInterval(ALARM_NAME, this.interval, () => this.doBackup())
        } else {
            alarmManager.remove(ALARM_NAME)
        }
    }

    private needSchedule(): boolean {
        return !!this.needBackup && !!this.interval
    }

    private async doBackup(): Promise<void> {
        const result = await processor.syncData()
        if (!result.success) {
            console.warn(`Failed to backup ts=${Date.now()}, msg=${result.errorMsg}`)
        }
    }
}

export default BackupScheduler