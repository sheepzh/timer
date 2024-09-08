import { deleteDir, judgeDirExist, makeDir, readFile, WebDAVAuth, WebDAVContext, writeFile } from "@api/web-dav"
import DateIterator from "@util/date-iterator"
import { processDir } from "../common"
import { CLIENT_FILE_NAME, convertClients2Markdown, divideByDate, parseData } from "../markdown"

function prepareContext(context: timer.backup.CoordinatorContext<never>): WebDAVContext {
    const { auth, ext } = context
    let { endpoint } = ext || {}
    const webDavAuth: WebDAVAuth = {
        type: "password",
        username: auth?.login?.acc,
        password: auth?.login?.psw,
    }
    return { auth: webDavAuth, endpoint }
}

export default class WebDAVCoordinator implements timer.backup.Coordinator<never> {
    async updateClients(context: timer.backup.CoordinatorContext<never>, clients: timer.backup.Client[]): Promise<void> {
        const dirPath = processDir(context?.ext?.dirPath)
        const clientFilePath = `${dirPath}${CLIENT_FILE_NAME}`
        const content = convertClients2Markdown(clients)
        const davContext = prepareContext(context)
        await writeFile(davContext, clientFilePath, content)
    }

    async listAllClients(context: timer.backup.CoordinatorContext<never>): Promise<timer.backup.Client[]> {
        const dirPath = processDir(context?.ext?.dirPath)
        const clientFilePath = `${dirPath}${CLIENT_FILE_NAME}`
        const davContext = prepareContext(context)
        try {
            const content = await readFile(davContext, clientFilePath)
            return parseData(content) || []
        } catch (e) {
            console.warn("Failed to read WebDav file content", e)
            return []
        }
    }

    async download(context: timer.backup.CoordinatorContext<never>, dateStart: Date, dateEnd: Date, targetCid?: string): Promise<timer.stat.RowBase[]> {
        const dirPath = processDir(context?.ext?.dirPath)
        const davContext = prepareContext(context)
        targetCid = targetCid || context?.cid

        const dateIterator = new DateIterator(dateStart, dateEnd)
        const result: timer.stat.RowBase[] = []
        await Promise.all(dateIterator.toArray().map(async date => {
            const filePath = `${dirPath}${targetCid}/${date}.md`
            const fileContent = await readFile(davContext, filePath)
            const rows: timer.stat.RowBase[] = parseData(fileContent)
            rows?.forEach?.(row => result.push(row))
        }))
        return result
    }

    async upload(context: timer.backup.CoordinatorContext<never>, rows: timer.stat.RowBase[]): Promise<void> {
        const dateAndContents = divideByDate(rows)
        const dirPath = processDir(context?.ext?.dirPath)
        const cid = context?.cid
        const davContext = prepareContext(context)

        const clientPath = await this.checkClientDirExist(davContext, dirPath, cid)

        await Promise.all(
            Object.entries(dateAndContents).map(async ([date, content]) => {
                const filePath = `${clientPath}/${date}.md`
                await writeFile(davContext, filePath, content)
            })
        )
    }

    private async checkClientDirExist(davContext: WebDAVContext, dirPath: string, cid: string) {
        const clientDirPath = `${dirPath}${cid}`
        const clientExist = await judgeDirExist(davContext, clientDirPath)
        if (!clientExist) {
            await makeDir(davContext, clientDirPath)
        }
        return clientDirPath
    }

    async testAuth(auth: timer.backup.Auth, ext: timer.backup.TypeExt): Promise<string> {
        const { endpoint, dirPath } = ext || {}
        if (!endpoint) {
            return "The endpoint is blank"
        }
        if (!dirPath) {
            return "The path of directory is blank"
        }
        const { acc, psw } = auth?.login || {}
        if (!acc) {
            return 'Account is blank'
        }
        if (!psw) {
            return 'Password is blank'
        }
        const davAuth: WebDAVAuth = { type: 'password', username: acc, password: psw }
        const davContext: WebDAVContext = { endpoint, auth: davAuth }
        const webDavPath = processDir(dirPath)
        try {
            const exist = await judgeDirExist(davContext, webDavPath)
            if (!exist) {
                return "Directory not found"
            }
        } catch (e) {
            return (e as Error)?.message || e
        }
    }

    async clear(context: timer.backup.CoordinatorContext<never>, client: timer.backup.Client): Promise<void> {
        const cid = client.id
        const dirPath = processDir(context.ext?.dirPath)
        const davContext = prepareContext(context)
        const clientDirPath = `${dirPath}${cid}/`
        const exist = await judgeDirExist(davContext, clientDirPath)

        if (!exist) return
        await deleteDir(davContext, clientDirPath)
    }
}