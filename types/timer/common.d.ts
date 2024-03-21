declare namespace timer.common {
    type PageQuery = {
        num?: number
        size?: number
    }
    type PageResult<T> = {
        list: T[]
        total: number
    }
}