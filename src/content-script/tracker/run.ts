import { onRuntimeMessage, sendMsg2Runtime } from "@api/chrome/runtime"

const INTERVAL = 2000

class RunTracker {
    private url: string
    private sites: timer.site.SiteKey[]

    constructor(url: string) {
        this.url = url
    }

    init(): void {
        this.fetchSite()
        setInterval(() => {
            if (!this.sites?.length) return
            this.collect()
        }, INTERVAL)

        onRuntimeMessage<void, void>(async req => {
            if (req.code === 'siteRunChange') {
                this.fetchSite()
                return { code: 'success' }
            }
            return { code: 'ignore' }
        })
    }

    private fetchSite() {
        sendMsg2Runtime('cs.getRunSites', this.url)
            .then(sites => this.sites = sites ?? [])
            .catch(() => {
                // Extension reloaded, so terminate
                this.sites = []
            })
    }

    private collect() {

    }
}

export default RunTracker