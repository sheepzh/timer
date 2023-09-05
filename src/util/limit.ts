export function matches(item: timer.limit.Item, url: string): boolean {
    const regular = new RegExp(`^${(item?.cond || '').split('*').join('.*')}`)
    return regular.test(url)
}

export function hasLimited(item: timer.limit.Item): boolean {
    return (item.waste ?? 0) >= (item.time ?? 0) * 1000
}