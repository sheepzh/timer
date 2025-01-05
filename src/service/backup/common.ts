export function processDir(dirPath: string) {
    dirPath = dirPath?.trim?.()
    if (!dirPath) {
        return null
    }
    while (dirPath.startsWith("/")) {
        dirPath = dirPath.substring(1)
    }
    if (!dirPath.endsWith("/")) {
        dirPath = dirPath + '/'
    }
    return dirPath
}