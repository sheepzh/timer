type ReportFunction = (ev: timer.stat.Event) => Promise<void>

const INTERVAL = 1000

/**
 * Tracker client, used in the content-script
 */
export default class TrackerClient {
    docVisible: boolean = false
    start: number = Date.now()
    report: ReportFunction

    constructor(report: ReportFunction) {
        this.report = report
    }

    init() {
        this.docVisible = document?.visibilityState === 'visible'
        document?.addEventListener('visibilitychange', () => this.changeState(document?.visibilityState === 'visible'))
        setInterval(() => this.collect(), INTERVAL)
    }

    private changeState(docVisible: boolean) {
        this.docVisible && !docVisible && this.pause()
        !this.docVisible && docVisible && this.resume()

        this.docVisible = docVisible
    }

    private async collect(ignoreTabCheck?: boolean) {
        if (!this.docVisible) return

        const now = Date.now()
        const lastTime = this.start
        this.start = now
        const interval = now - lastTime
        if (interval <= 0 || interval > INTERVAL * 2) {
            // Invalid time
            return
        }

        const data: timer.stat.Event = {
            start: lastTime,
            end: now,
            url: location?.href,
            ignoreTabCheck
        }
        try {
            await this.report?.(data)
        } catch (_) { }
    }

    private pause() {
        this.collect(true)
    }

    private resume() {
        this.start = Date.now()
    }
}
