export type QueryData = () => Promise<void>

export type PaginationInfo = {
    size: number
    num: number
    total: number
}