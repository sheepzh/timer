import { SourceFilesModel } from "@crowdin/crowdin-api-client"
import { CrowdinClient, getClientFromEnv } from "./client"
import { ALL_DIRS, ALL_TRANS_LOCALES, RSC_FILE_SUFFIX, checkMainBranch, crowdinLangOf, mergeMessage } from "./common"
import StreamZip, { StreamZipAsync } from "node-stream-zip"
import { createReadStream, createWriteStream, mkdirSync, write } from "fs"
import request from "request"
import { createGunzip, createUnzip, unzipSync } from "zlib"
import axios from "axios"

async function processFile(client: CrowdinClient, file: SourceFilesModel.File, dir: Dir): Promise<void> {
    const itemSets: Partial<Record<timer.Locale, ItemSet>> = {}
    for (const locale of ALL_TRANS_LOCALES) {
        const lang = crowdinLangOf(locale)
        const items: ItemSet = await client.downloadTranslations(file.id, lang)
        items && Object.keys(items).length && (itemSets[locale] = items)
    }
    await mergeMessage(dir, file.name.replace('.json', RSC_FILE_SUFFIX), itemSets)
}

async function processDir(client: CrowdinClient, branch: SourceFilesModel.Branch, dir: Dir): Promise<void> {
    const directory = await client.getDirByName({ name: dir, branchId: branch.id })
    const files = await client.listFilesByDirectory(directory.id)
    for (const file of files) {
        await processFile(client, file, dir)
    }
}

async function main() {
    const client = getClientFromEnv()
    const branch = await checkMainBranch(client)
    // for (const dir of ALL_DIRS) {
    //     // Parallel execution for each directory
    //     processDir(client, branch, dir)
    // }
    const translation = await client.buildProjectTranslation(branch.id)
    // console.log(JSON.stringify(translation))
}

import decompress from "decompress"

async function test() {
    // const res = await axios.get(
    //     "https://crowdin-packages.downloads.crowdin.com/49566251/516822/589/file-589-1458572885344568001a119c2220a324.zip?response-content-disposition=attachment%3B%20filename%3D%22firefox%20%28fr%2C%20es-ES%2C%20de%2C%20ja%2C%20pt-PT%2C%20uk%2C%20zh-TW%29.zip%22&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWVY4ALJ236MAOUVP%2F20240920%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240920T082744Z&X-Amz-SignedHeaders=host&X-Amz-Expires=120&X-Amz-Signature=b21d3bf94aab740c258fd1a72133dd735684fe004475af09c51b846961b6d358",
    //     { responseType: 'stream' },
    // )
    // const writer = createWriteStream('./temp.zip')
    // res.data.pipe(writer)
    // await new Promise((resolve, reject) => {
    //     res.data.pipe(writer)
    //     let error = null
    //     writer.on('error', err => {
    //         error = err
    //         writer.close()
    //         reject(err)
    //     })
    //     writer.on('close', () => {
    //         !error && resolve(true)
    //     })
    // })
    decompress("temp.zip", "temp")
}

test()

// main()