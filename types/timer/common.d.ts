declare namespace timer.common {
    type Pagination = {
        size: number
        num: number
        total: number
    }
    type PageQuery = {
        num?: number
        size?: number
    }
    type PageResult<T> = {
        list: T[]
        total: number
    }
}