import { Messages } from "../../../util/i18n"

export type OptionMessage = {
    popupMax: string
}

const _default: Messages<OptionMessage> = {
    zh_CN: {
        popupMax: '1. 今日数据显示前 {input} 条数据。'
    },
    en: {
        popupMax: '1. Today\'s data shows the first {input} data.'
    },
    ja: {
        popupMax: '1. 今日のデータは、最初の {input} データを示しています。'
    }
}

export default _default