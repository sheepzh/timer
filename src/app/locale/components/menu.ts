import { Messages } from "../../../util/i18n"

export type MenuMessage = {
    data: string
    dataReport: string
    dataHistory: string
    dataClear: string
    setting: string
}
const _default: Messages<MenuMessage> = {
    zh_CN: {
        data: '我的数据',
        dataReport: '报表明细',
        dataHistory: '历史趋势',
        dataClear: '内存管理',
        setting: '扩展选项'
    },
    en: {
        data: 'My datas',
        dataReport: 'Report',
        dataHistory: 'Historical trend',
        dataClear: 'Memory situation',
        setting: 'Options'
    },
    ja: {
        data: '私のデータ',
        dataReport: '報告する',
        dataHistory: '歴史傾向',
        dataClear: '記憶状況',
        setting: '拡張設定',
    }
}

export default _default