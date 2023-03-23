import { SourceFilesModel } from "@crowdin/crowdin-api-client"
import { CrowdinClient, getClientFromEnv } from "./client"
import { ALL_DIRS, ALL_TRANS_LOCALES, checkMainBranch, crowdinLangOf, mergeMessage } from "./common"

async function processFile(client: CrowdinClient, file: SourceFilesModel.File, dir: Dir): Promise<void> {
    const itemSets: Partial<Record<timer.Locale, ItemSet>> = {}
    for (const locale of ALL_TRANS_LOCALES) {
        const lang = crowdinLangOf(locale)
        const items: ItemSet = await client.downloadTranslations(file.id, lang)
        items && Object.keys(items).length && (itemSets[locale] = items)
    }
    await mergeMessage(dir, file.name.replace('.json', '.ts'), itemSets)
}

async function processDir(client: CrowdinClient, branch: SourceFilesModel.Branch, dir: Dir): Promise<void> {
    const directory = await client.getDirByName({ name: dir, branchId: branch.id })
    const files = await client.listFilesByDirectory(directory.id)
    for (const file of files) {
        processFile(client, file, dir)
    }
}

async function main() {
    const client = getClientFromEnv()
    const branch = await checkMainBranch(client)
    for (const dir of ALL_DIRS) {
        await processDir(client, branch, dir)
    }
}

main()