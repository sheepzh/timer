import {
    WebdavRequestContext,
    getFileContent,
    listAllFiles,
    updateFile,
    deleteFile,
    WebDAVAuth,
} from "@api/webdav"
import { convertClients2Markdown, divideByDate, parseData } from "../obsidian/compressor"
import DateIterator from "@util/date-iterator"
import { parseWebDAVResponse } from "./compressor"

const CLIENT_FILE_NAME = "clients_no_modify.md"

function processDir(dirPath: string) {
    dirPath = dirPath?.trim?.()
    if (!dirPath) {
        return null
    }
    while (dirPath.startsWith("/")) {
        dirPath = dirPath.substring(1)
    }
    if (!dirPath.endsWith("/")) {
        dirPath = dirPath + "/"
    }
    return dirPath
}

function prepareContext(context: timer.backup.CoordinatorContext<never, WebDAVAuth>) {
    const { auth, ext, cid } = context
    let { endpoint, dirPath } = ext || {}
    dirPath = processDir(dirPath)
    const ctx: WebdavRequestContext = { auth, endpoint }
    return { ctx, dirPath, cid }
}

export default class WebdavCoordinator
    implements timer.backup.Coordinator<never, WebDAVAuth> {
    async updateClients(
        context: timer.backup.CoordinatorContext<never, WebDAVAuth>,
        clients: timer.backup.Client[]
    ): Promise<void> {
        const { ctx, dirPath } = prepareContext(context)
        const clientFilePath = `${dirPath}${CLIENT_FILE_NAME}`
        const content = convertClients2Markdown(clients)
        await updateFile(ctx, clientFilePath, content)
    }

    async listAllClients(
        context: timer.backup.CoordinatorContext<never, WebDAVAuth>
    ): Promise<timer.backup.Client[]> {
        const { ctx, dirPath } = prepareContext(context)
        const clientFilePath = `${dirPath}${CLIENT_FILE_NAME}`
        try {
            const content = await getFileContent(ctx, clientFilePath)
            return content ? parseData(content) : []
        } catch (e) {
            console.error(e)
            return []
        }
    }

    async download(
        context: timer.backup.CoordinatorContext<never, WebDAVAuth>,
        dateStart: Date,
        dateEnd: Date,
        targetCid?: string
    ): Promise<timer.stat.RowBase[]> {
        const { ctx, dirPath, cid } = prepareContext(context)

        const dateIterator = new DateIterator(dateStart, dateEnd)
        const result: timer.stat.RowBase[] = []
        await Promise.all(
            dateIterator.toArray().map(async (date) => {
                const filePath = `${dirPath}${targetCid || cid}/${date}.md`
                const fileContent = await getFileContent(ctx, filePath)
                const rows: timer.stat.RowBase[] = parseData(fileContent)
                rows?.forEach?.((row) => result.push(row))
            })
        )
        return result
    }

    async upload(
        context: timer.backup.CoordinatorContext<never, WebDAVAuth>,
        rows: timer.stat.RowBase[]
    ): Promise<void> {
        const { ctx, dirPath, cid } = prepareContext(context)

        const dateAndContents = divideByDate(rows)
        await Promise.all(
            Object.entries(dateAndContents).map(async ([date, content]) => {
                const filePath = `${dirPath}${cid}/${date}.md`
                await updateFile(ctx, filePath, content)
            })
        )
    }

    async testAuth(auth: WebDAVAuth, ext: timer.backup.TypeExt): Promise<string> {
        let { endpoint, dirPath } = ext || {}
        dirPath = processDir(dirPath)
        if (!dirPath) {
            return "Path of directory is blank"
        }
        const result = await listAllFiles({ endpoint, auth, }, dirPath)
        return result.message
    }

    async clear(
        context: timer.backup.CoordinatorContext<never, WebDAVAuth>,
        client: timer.backup.Client
    ): Promise<void> {
        const cid = client.id
        const { ctx, dirPath } = prepareContext(context)
        const clientDirPath = `${dirPath}${cid}/`
        let files = []
        try {
            const result = await listAllFiles(ctx, clientDirPath)
            if (result.success) {
                const items = parseWebDAVResponse(result.data)
                files = items
                    .filter((i) => i.type === "file")
                    .map((i) => i.name)
            }
        } catch { }
        await Promise.all(
            files.map(async (file) => {
                const filePath = clientDirPath + file
                await deleteFile(ctx, filePath)
            })
        )
    }
}
