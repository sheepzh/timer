
import { exitWith } from "../util/process"
import { ALL_DIRS, ALL_TRANS_LOCALES, checkMainBranch, crowdinLangOf, isIgnored, readAllMessages, transMsg } from "./common"
import { CrowdinClient, getClientFromEnv } from "./client"
import { SourceFilesModel } from "@crowdin/crowdin-api-client"
import { groupBy } from "@util/array"

async function processDirMessage(client: CrowdinClient, file: SourceFilesModel.File, message: ItemSet, lang: CrowdinLanguage): Promise<void> {
    const strings = await client.listStringsByFile(file.id)
    const stringMap = groupBy(strings, s => s.identifier, l => l[0])
    for (const [identifier, text] of Object.entries(message)) {
        const string = stringMap[identifier]
        if (!string) {
            console.log(`Can't found string of identifier: ${identifier}, file: ${file.path}`)
            continue
        }
        if (text === string.text) {
            // The same as original text
            console.log(`Translation same as origin text of ${string.identifier} in ${file.path}`)
            continue
        }
        const exist = await client.existTranslationByStringAndLang({ stringId: string.id, lang })
        if (exist) {
            // Already exist, not sync
            continue
        }
        await client.createTranslation({ stringId: string.id, lang }, text)
        console.log(`Created trans: stringId=${string.id}, lang=${lang}, text=${text}`)
    }
}

async function processDir(client: CrowdinClient, dir: Dir, branch: SourceFilesModel.Branch): Promise<void> {
    const messages = await readAllMessages(dir)
    const directory = await client.getDirByName({
        name: dir,
        branchId: branch.id,
    })
    if (!directory) {
        exitWith("Directory not found: " + dir)
    }
    const files = await client.listFilesByDirectory(directory.id)
    console.log(`find ${files.length} files of ${dir}`)
    const fileMap = groupBy(files, f => f.name, l => l[0])
    for (const [tsFilename, message] of Object.entries(messages)) {
        if (isIgnored(dir, tsFilename)) {
            continue
        }
        console.log(`Start to sync translations of ${tsFilename}`)
        const filename = tsFilename.replace('.ts', '.json')
        const crowdinFile = fileMap[filename]
        if (!crowdinFile) {
            console.log(`Failed to find file: dir=${dir}, filename=${tsFilename}`)
            continue
        }

        for (const locale of ALL_TRANS_LOCALES) {
            const strings = transMsg(message[locale])
            const crwodinLang = crowdinLangOf(locale)
            await processDirMessage(client, crowdinFile, strings, crwodinLang)
        }
    }
}

async function main() {
    const client = getClientFromEnv()
    const branch = await checkMainBranch(client)

    for (const dir of ALL_DIRS) {
        await processDir(client, dir, branch)
    }
}

main()