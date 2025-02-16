import { onRuntimeMessage, sendMsg2Runtime } from "@api/chrome/runtime"

class RunTimeTracker {
    private start: number
    private url: string
    // Real host, including builtin hosts
    private host: string

    constructor(url: string) {
        this.url = url
    }

    init(): void {
        this.start = Date.now()
        this.fetchSite()

        onRuntimeMessage<void, void>(async req => {
            if (req.code === 'siteRunChange') {
                this.fetchSite()
                return { code: 'success' }
            }
            return { code: 'ignore' }
        })

        setInterval(() => this.collect(), 1000)
    }

    private fetchSite() {
        sendMsg2Runtime('cs.getRunSites', this.url)
            .then((site: timer.site.SiteKey) => this.host = site?.host)
            // Extension reloaded, so terminate
            .catch(() => this.host = null)
    }

    private collect() {
        const now = Date.now()
        const lastTime = this.start

        const event: timer.core.Event = {
            start: lastTime,
            end: now,
            url: this.url,
            ignoreTabCheck: false,
            host: this.host,
        }

        sendMsg2Runtime('cs.trackRunTime', event)
            .then(() => this.start = now)
            .catch(() => { })
    }
}

export default RunTimeTracker