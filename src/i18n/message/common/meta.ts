
export type MetaMessage = {
    name: string
    marketName: string
    description: string
}

const _default: Messages<MetaMessage> = {
    zh_CN: {
        name: '网费很贵',
        marketName: '网费很贵 - 上网时间统计',
        description: '做最好用的上网时间统计工具。',
    },
    zh_TW: {
        name: '網費很貴',
        marketName: '網費很貴 - 上網時間統計',
        description: '做最好用的上網時間統計工具。',
    },
    ja: {
        name: 'Web時間統計',
        marketName: 'Web時間統計',
        description: '最高のオンライン時間統計ツールを作成します。',
    },
    en: {
        name: 'Timer',
        marketName: 'Timer - Browsing Time & Visit count',
        description: 'To be the BEST web timer.',
    },
}

export default _default