import { VNode } from "vue"
import { getI18nVal, I18nKey } from "."

export declare type I18nResultItem = VNode | string

const findParamAndReplace = (resultArr: I18nResultItem[], [key, value]: any) => {
    const paramPlacement = `{${key}}`
    const temp = []
    resultArr.forEach((item) => {
        if (typeof item === 'string' && item.includes(paramPlacement)) {
            // 将 string 替换成具体的 Vnode
            let splited: I18nResultItem[] = (item as string).split(paramPlacement)
            splited = splited.reduce((left, right) => left.length ? left.concat(value, right) : left.concat(right), [])
            temp.push(...splited)
        } else {
            temp.push(item)
        }
    })
    return temp
}

export type NodeTranslateProps<MessageType> = {
    key: I18nKey<MessageType>,
    param: { [key: string]: I18nResultItem }
}

/**
 * Translate with slots for vue
 * 
 * @param key key path
 * @param param param, slot vnodes
 * @returns The array of vnodes or strings
 */
export function tN<MessageType>(messages: MessageType, props: NodeTranslateProps<MessageType>): I18nResultItem[] {
    const { key, param } = props
    const result = getI18nVal(messages, key)
    let resultArr: I18nResultItem[] = Object.entries(param).reduce(findParamAndReplace, [result as I18nResultItem])
    return resultArr
}

