import SiteDatabase from "@db/site-database"

const siteDatabase = new SiteDatabase(chrome.storage.local)

function compileAntPattern(antPattern: string): RegExp {
    const segments = antPattern.split('/')
    let patternStr = segments.map(seg => {
        if (seg === "**") {
            return ".*"
        } else {
            return seg.replace?.(/\*/g, "[^/]*").replace(/\./g, "\\.")
        }
    }).join("/")
    // "google.com/**" => google\.com.*
    if (patternStr.endsWith("/.*")) {
        patternStr = patternStr.substring(0, patternStr.length - 3) + ".*"
    }

    return new RegExp("^(.+://)?" + patternStr + "/?(\\?.*)?$")
}

/**
 * The singleton implementation of virtual sites holder
 * 
 * @since 1.6.0 
 */
class VirtualSiteHolder {
    hostSiteRegMap: Record<string, RegExp> = {}

    constructor() {
        siteDatabase.select().then(sitesInfos => sitesInfos
            .filter(s => s.virtual)
            .forEach(site => this.updateRegularExp(site))
        )
        siteDatabase.addChangeListener((oldAndNew) => oldAndNew.forEach(([oldVal, newVal]) => {
            if (!newVal) {
                // deleted
                delete this.hostSiteRegMap[oldVal.host]
            } else {
                this.updateRegularExp(newVal)
            }
        }))
    }

    private updateRegularExp(siteInfo: timer.site.SiteInfo) {
        const { host } = siteInfo
        this.hostSiteRegMap[host] = compileAntPattern(host)
    }

    /**
     * Find the virtual sites which matches the target url
     * 
     * @param url 
     * @returns virtul sites
     */
    findMatched(url: string): string[] {
        return Object.entries(this.hostSiteRegMap)
            .filter(([_, reg]) => reg.test(url))
            .map(([k]) => k)
    }
}

export default new VirtualSiteHolder()