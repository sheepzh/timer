import resource from './console-resource.json'

export type ConsoleMessage = {
    consoleLog: string
    closeAlert: string
    timeWithHour: string
    timeWithMinute: string
    timeWithSecond: string
}

const _default: Messages<ConsoleMessage> = resource

export default _default