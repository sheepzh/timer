import Crowdin, {
    Credentials,
    Pagination,
    PatchRequest,
    ResponseList,
    SourceFilesModel,
    SourceStringsModel,
    StringTranslationsModel,
    UploadStorageModel,
} from '@crowdin/crowdin-api-client'
import axios from 'axios'

const PROJECT_ID = 516822

const MAIN_BRANCH_NAME = 'main'

/**
 * The iterator of response
 */
class PaginationIterator<T> {
    private offset = 0
    private limit = 25
    private isEnd = false
    private buf: T[] = []
    private cursor = 0
    private query: (pagination: Pagination) => Promise<ResponseList<T>>

    constructor(query: (pagination: Pagination) => Promise<ResponseList<T>>) {
        this.query = query
    }

    reset(): void {
        this.offset = 0
        this.isEnd = false
        this.buf = []
        this.cursor = 0
    }

    async findFirst(predicate: (ele: T) => boolean): Promise<T> {
        while (true) {
            const data = await this.next()
            if (!data) {
                break
            }
            if (data && predicate(data)) {
                return data
            }
        }
        return undefined
    }

    async findAll(predicate?: ((ele: T) => boolean)): Promise<T[]> {
        const result = []
        while (true) {
            const data = await this.next()
            if (!data) {
                break
            }
            if (predicate ? predicate(data) : true) {
                result.push(data)
            }
        }
        return result
    }

    async next(): Promise<T> {
        if (this.isEnd) {
            return undefined
        }
        if (this.cursor >= this.buf.length) {
            await this.processBuf()
        }
        if (this.isEnd) {
            return undefined
        }
        return this.buf[this.cursor++]
    }

    private async processBuf() {
        const pagination: Pagination = { offset: this.offset, limit: this.limit }
        const list = await this.query(pagination)
        const data = list?.data
        if (!data?.length) {
            this.isEnd = true
        } else {
            this.buf = data.map(obj => obj.data)
            this.cursor = 0
            this.offset += this.buf.length
        }
    }
}

async function createStorage(fileName: string, content: any): Promise<UploadStorageModel.Storage> {
    const response = await this.crowdin.uploadStorageApi.addStorage(fileName, content)
    return response.data
}

async function createFile(this: CrowdinClient,
    directoryId: number,
    storage: UploadStorageModel.Storage,
    fileName: string
): Promise<SourceFilesModel.File> {
    const request: SourceFilesModel.CreateFileRequest = {
        name: fileName,
        storageId: storage.id,
        directoryId,
        type: 'json',
    }
    const response = await this.crowdin.sourceFilesApi.createFile(PROJECT_ID, request)
    return response.data
}

async function restoreFile(this: CrowdinClient, storage: UploadStorageModel.Storage, existFile: SourceFilesModel.File): Promise<SourceFilesModel.File> {
    const response = await this.crowdin.sourceFilesApi.updateOrRestoreFile(PROJECT_ID, existFile.id, { storageId: storage.id })
    return response.data
}

async function getMainBranch(this: CrowdinClient): Promise<SourceFilesModel.Branch> {
    return new PaginationIterator(
        pagination => this.crowdin.sourceFilesApi.listProjectBranches(PROJECT_ID, { ...pagination })
    ).findFirst(e => e.name === MAIN_BRANCH_NAME)
}

async function createMainBranch(): Promise<SourceFilesModel.Branch> {
    const request: SourceFilesModel.CreateBranchRequest = {
        name: MAIN_BRANCH_NAME
    }
    const res = await this.crowdin.sourceFilesApi.createBranch(PROJECT_ID, request)
    return res.data
}

async function getOrCreateMainBranch(this: CrowdinClient): Promise<SourceFilesModel.Branch> {
    let branch = await this.getMainBranch()
    if (!branch) {
        branch = await this.createMainBranch()
    }
    console.info("getOrCreateMainBranch: " + JSON.stringify(branch))
    return branch
}

function getFileByName(this: CrowdinClient, param: NameKey): Promise<SourceFilesModel.File> {
    return new PaginationIterator(
        p => this.crowdin.sourceFilesApi.listProjectFiles(PROJECT_ID, { ...p, branchId: param.branchId })
    ).findFirst(t => t.name === param.name)
}

function getDirByName(this: CrowdinClient, param: NameKey): Promise<SourceFilesModel.Directory> {
    return new PaginationIterator(
        p => this.crowdin.sourceFilesApi.listProjectDirectories(PROJECT_ID, { ...p, branchId: param.branchId })
    ).findFirst(d => d.name === param.name)
}

async function createDirectory(this: CrowdinClient, param: NameKey): Promise<SourceFilesModel.Directory> {
    const res = await this.crowdin.sourceFilesApi.createDirectory(PROJECT_ID, {
        name: param.name,
        branchId: param.branchId,
    })
    return res.data
}

function listFilesByDirectory(this: CrowdinClient, directoryId: number) {
    return new PaginationIterator(
        p => this.crowdin.sourceFilesApi.listProjectFiles(PROJECT_ID, { ...p, directoryId: directoryId })
    ).findAll()
}

function listStringsByFile(this: CrowdinClient, fileId: number): Promise<SourceStringsModel.String[]> {
    return new PaginationIterator(
        p => this.crowdin.sourceStringsApi.listProjectStrings(PROJECT_ID, { ...p, fileId: fileId })
    ).findAll()
}

async function batchCreateString(
    this: CrowdinClient,
    fileId: number,
    content: ItemSet,
): Promise<void> {
    for (const [path, value] of Object.entries(content)) {
        const request: SourceStringsModel.CreateStringRequest = {
            fileId,
            text: value,
            identifier: path,
        }
        console.log(`Try to create new string: ${JSON.stringify(request)}`)
        await this.crowdin.sourceStringsApi.addString(PROJECT_ID, request)
    }
}

async function batchUpdateIfNecessary(this: CrowdinClient,
    content: ItemSet,
    existStringsKeyMap: { [path: string]: SourceStringsModel.String }
): Promise<void> {
    console.log("=========start to update strings========")
    console.log("Content length: " + Object.keys(content).length)
    for (const [path, value] of Object.entries(content)) {
        const string = existStringsKeyMap[path]
        const patch: PatchRequest[] = []
        string?.text !== value && patch.push({
            op: 'replace',
            path: '/text',
            value: value
        })
        if (!patch.length) {
            continue
        }
        console.log('Try to edit string: ' + string.identifier)
        await this.crowdin.sourceStringsApi.editString(PROJECT_ID, string.id, patch)
    }
    console.log("=========end to update strings========")
}

async function batchDeleteString(this: CrowdinClient, stringIds: number[]): Promise<void> {
    console.log("=========start to delete strings========")
    for (const stringId of stringIds) {
        await this.crowdin.sourceStringsApi.deleteString(PROJECT_ID, stringId)
        console.log("Delete string: id=" + stringId)
    }
    console.log("=========end to delete strings========")
}

async function listAllTranslationByStringAndLang(this: CrowdinClient, transKey: TranslationKey): Promise<StringTranslationsModel.StringTranslation[]> {
    const { stringId, lang } = transKey
    return new PaginationIterator(
        p => this.crowdin.stringTranslationsApi.listStringTranslations(PROJECT_ID, stringId, lang, { ...p })
    ).findAll()
}

async function existTranslationByStringAndLang(this: CrowdinClient, transKey: TranslationKey): Promise<boolean> {
    const { stringId, lang } = transKey
    const trans = await new PaginationIterator(
        p => this.crowdin.stringTranslationsApi.listStringTranslations(PROJECT_ID, stringId, lang, { ...p })
    ).findFirst(_ => true)
    return !!trans
}

async function createTranslation(this: CrowdinClient, transKey: TranslationKey, text: string) {
    const { stringId, lang } = transKey
    const request: StringTranslationsModel.AddStringTranslationRequest = {
        stringId,
        languageId: lang,
        text
    }
    await this.crowdin.stringTranslationsApi.addTranslation(PROJECT_ID, request)
}


const CROWDIN_XML_PATTERN = /<string name="(.*?)">(.*?)<\/string>/g

async function downloadTranslations(this: CrowdinClient, fileId: number, lang: CrowdinLanguage): Promise<ItemSet> {
    const res = await this.crowdin.translationsApi.exportProjectTranslation(PROJECT_ID, {
        targetLanguageId: lang,
        fileIds: [fileId],
        format: 'android',
    })
    const downloadUrl = res?.data?.url
    const fileRes = await axios.get(downloadUrl)
    const xmlData: string = fileRes.data
    const items = xmlData.matchAll(CROWDIN_XML_PATTERN)
    const itemSet: ItemSet = {}
    for (const item of Array.from(items)) {
        const result = new RegExp(CROWDIN_XML_PATTERN).exec(item[0])
        const key = result[1]
        const text = result[2]
        itemSet[key] = text
    }
    return itemSet
}

/**
 * The wrapper of client with auth
 */
export class CrowdinClient {
    crowdin: Crowdin

    constructor(token: string) {
        const credentials: Credentials = {
            token: token
        }
        this.crowdin = new Crowdin(credentials)
        console.info("Intialized client successfully")
    }
    createStorage = createStorage
    /**
     * Get the main branch
     * 
     * @returns main branch or undefined
     */
    getMainBranch = getMainBranch

    /**
     * Create the main branch
     */
    createMainBranch = createMainBranch

    getOrCreateMainBranch = getOrCreateMainBranch

    createFile = createFile

    restoreFile = restoreFile

    getFileByName = getFileByName

    getDirByName = getDirByName

    createDirectory = createDirectory

    listFilesByDirectory = listFilesByDirectory

    listStringsByFile = listStringsByFile

    batchCreateString = batchCreateString

    batchUpdateIfNecessary = batchUpdateIfNecessary

    batchDeleteString = batchDeleteString

    listAllTranslationByStringAndLang = listAllTranslationByStringAndLang

    existTranslationByStringAndLang = existTranslationByStringAndLang

    createTranslation = createTranslation

    downloadTranslations = downloadTranslations
}

/**
 * Get the client from environment variable [TIMER_CROWDIN_AUTH]
 * 
 * @returns client
 */
export function getClientFromEnv(): CrowdinClient {
    const envVar = process.env?.TIMER_CROWDIN_AUTH
    if (!envVar) {
        console.error("Failed to get the variable named [TIMER_CROWDIN_AUTH]")
        process.exit(1)
    }
    return new CrowdinClient(envVar)
}
