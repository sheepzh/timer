import periodService from "../../service/period-service"
import timerService from "../../service/timer-service"
import TimerContext from "./context"

export default function save(context: TimerContext) {
    if (context.isPaused()) return
    timerService.addFocusAndTotal(context.timeMap)
    const focusEntry = context.findFocus()
    // Add periodtime
    focusEntry && periodService.add(context.lastCollectTime, focusEntry[1].focus)
    context.resetTimeMap()
}
