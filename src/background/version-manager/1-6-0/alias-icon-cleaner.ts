import HostAliasDatabase from "@db/host-alias-database"
import IconUrlDatabase from "@db/icon-url-database"
import siteService from "@service/site-service"

const storage = chrome.storage.local
const aliasDatabase = new HostAliasDatabase(storage)
const iconDatabase = new IconUrlDatabase(storage)

/**
 * Merge alias and icon to site
 * 
 * @since 1.6.0
 */
export default class AliasIconCleaner implements VersionProcessor {

    since(): string {
        return "1.6.0"
    }

    async process(reason: ChromeOnInstalledReason): Promise<void> {
        // Only trigger when updating
        if (reason !== 'update') {
            return
        }
        const hostIcons = await iconDatabase.listAll()
        const iconResults = await Promise.all(
            Object.entries(hostIcons).map(
                async ([host, iconUrl]) => {
                    await siteService.saveIconUrl({ host }, iconUrl)
                    await iconDatabase.remove(host)
                }
            )
        )

        const alias = await aliasDatabase.selectAll()
        const aliasResults = await Promise.all(
            alias.map(
                async site => {
                    await siteService.saveAlias(site, site.alias, site.source)
                    await aliasDatabase.remove(site)
                }
            )
        )
        console.log(`Merge ${iconResults?.length} icons, ${aliasResults?.length} alias`)
    }
}