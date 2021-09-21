import limitService from "../../service/limit-service"
import periodService from "../../service/period-service"
import timerService from "../../service/timer-service"
import CollectionContext from "./collection-context"

export default function save(collectionContext: CollectionContext) {
    const context = collectionContext.timerContext
    if (context.isPaused()) return
    timerService.addFocusAndTotal(context.timeMap)
    const focusEntry = context.findFocus()

    if (focusEntry) {
        // Add period time
        periodService.add(context.lastCollectTime, focusEntry[1].focus)
        // Add limit time
        limitService.addFocusTime(collectionContext.focusHost, collectionContext.focusUrl, focusEntry[1].focus)
    }
    context.resetTimeMap()
}
