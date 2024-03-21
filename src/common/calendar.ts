import optionService from "@service/option-service"
import { formatTime } from "@util/time"

class Calendar {
    private dateDiff: number

    constructor() {
        optionService.getAllOption().then(v => this.setDayStart(v.dayStart || 0))
        optionService.addOptionChangeListener(v => this.setDayStart(v.dayStart || 0))
    }

    private setDayStart(second: number) {
        this.dateDiff = second * 1000
    }

    currentDate(): string {
        return formatTime(Date.now() - this.dateDiff, "{y}{m}{d}")
    }

    nowDate(): Date {
        return this.dateDiff ? new Date(Date.now() - this.dateDiff) : new Date()
    }

    getDateDiff(): number {
        return this.dateDiff
    }
}

export default new Calendar()