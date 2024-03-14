import { inject, provide } from "vue"

export const useProvide = <T = Record<string, any>>(namespace: string, ctx: T) => {
    Object.entries(ctx).forEach(([key, val]) => provide(`${namespace}_${key}`, val))
}

export const useProvider = <T = Record<string, any>>(namespace: string, ...keys: (keyof T)[]): Partial<T> => {
    const result: Partial<T> = {}
    Array.from(new Set(keys || [])).forEach(key => result[key] = inject(`${namespace}_${key as string}`))
    return result
}