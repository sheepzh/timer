import resource from "./list.json"

export type ListMessage = {
    searchPlaceholder: string
    title: string
}

const _default: Messages<ListMessage> = resource

export default _default