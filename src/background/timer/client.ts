type ReportFunction = (ev: timer.stat.Event) => Promise<void>

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
        setInterval(() => this.collect(), 1000)
    }

    private changeState(docVisible: boolean) {
        this.docVisible && !docVisible && this.pause()
        !this.docVisible && docVisible && this.resume()

        this.docVisible = docVisible
    }

    private async collect(ignoreTabCheck?: boolean) {
        if (!this.docVisible) return

        const end = Date.now()
        if (end <= this.start) return

        const data: timer.stat.Event = {
            start: this.start,
            end,
            url: location?.href,
            ignoreTabCheck
        }
        try {
            await this.report?.(data)
            this.start = end
        } catch (_) { }
    }

    private pause() {
        this.collect(true)
    }

    private resume() {
        this.start = Date.now()
    }
}
