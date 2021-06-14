import { VNode } from "vue"
import { getI18nVal, I18nKey } from "."

export declare type I18nResultItem = VNode | string

/**
 * Translate with slots for vue
 * 
 * @param key key path
 * @param param param, slot vnodes
 * @returns The array of vnodes or strings
 */
export function tN<MessageType>(messages: MessageType, key: I18nKey<MessageType>, param: { [key: string]: I18nResultItem }): I18nResultItem[] {
    const result = getI18nVal(messages, key)
    let resultArr: I18nResultItem[] = []
    resultArr.push(result)
    Object.keys(param).forEach(key => {
        const temp: I18nResultItem[] = []
        for (let i = 0; i < resultArr.length; i++) {
            const item = resultArr[i]
            const paramPlacement = `{${key}}`
            if (typeof item === 'string' && item.includes(paramPlacement)) {
                const value = param[key]
                // 将 string 替换成具体的 Vnode
                let splited: I18nResultItem[] = (item as string).split(paramPlacement)
                splited = splited.reduce((left, right) => left.length ? left.concat(value, right) : left.concat(right), [])
                temp.push(...splited)
            } else {
                temp.push(item)
            }
        }
        resultArr = temp
    })
    return resultArr
}

