import { Messages } from "../constant"

export type AppMessage = {
    name: string
    marketName: string
    description: string
    currentVersion: string
}

const _default: Messages<AppMessage> = {
    en: {
        name: 'Timer',
        marketName: 'Timer - Running & Browsing Time & Visit count',
        description: 'To be the BEST web timer.',
        currentVersion: 'Version: {version}'
    },
    zh_CN: {
        name: '网费很贵',
        marketName: '网费很贵 - 上网时间统计',
        description: '做最好用的上网时间统计工具。',
        currentVersion: '版本: v{version}'
    },
    ja: {
        name: 'Web時間統計',
        marketName: 'Web時間統計',
        description: '最高のオンライン時間統計ツールを作成します。',
        currentVersion: 'バージョン: v{version}'
    }
}

export default _default