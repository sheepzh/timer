import { Messages } from ".."

export type ContentScriptMessage = {
    openTimesConsoleLog: string
    usedTimeInConsoleLog: string
    timeWithHour: string
    timeWithMinute: string
    timeWithSecond: string
    timeLimitMsg: string
    more5Minutes: string
}
const _default: Messages<ContentScriptMessage> = {
    zh_CN: {
        openTimesConsoleLog: '今天您打开了 {time} 次 {host}。',
        usedTimeInConsoleLog: '它今天在您的电脑上运行了 {total}，其中您花费了 {focus}来浏览它。',
        timeWithHour: '{hour} 小时 {minute} 分 {second} 秒',
        timeWithMinute: '{minute} 分 {second} 秒',
        timeWithSecond: '{second} 秒',
        timeLimitMsg: '您已被【{appName}】限制上网',
        more5Minutes: '再看 5 分钟！！我保证！'
    },
    en: {
        openTimesConsoleLog: 'You have open {host} for {time} time(s) today.',
        usedTimeInConsoleLog: 'And it rans on your PC for {total} today, and is browsed for {focus}.',
        timeWithHour: '{hour} hour(s) {minute} minute(s) {second} second(s)',
        timeWithMinute: '{minute} minute(s) {second} second(s)',
        timeWithSecond: '{second} second(s)',
        timeLimitMsg: 'You have been restricted by [{appName}]',
        more5Minutes: 'More 5 minutes, please!!'
    },
    ja: {
        openTimesConsoleLog: '今日、あなたは {host} を {time} 回開きました。',
        usedTimeInConsoleLog: 'それは今日あなたのコンピュータで {total} 実行されました、そのうちあなたはそれを閲覧するために {focus} を費やしました。',
        timeWithHour: '{hour} 時間 {minute} 分 {second} 秒',
        timeWithMinute: '{minute} 分 {second} 秒',
        timeWithSecond: '{second} 秒',
        timeLimitMsg: '【{appName}】によって制限されています',
        more5Minutes: 'さらに5分間見てください！ ！ 約束します！'
    }
}

export default _default