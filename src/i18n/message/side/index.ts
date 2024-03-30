import calendarMessages, { CalendarMessage } from "../common/calendar"
import listMessages, { ListMessage } from "./list"

export type SideMessage = {
    list: ListMessage
    calendar: CalendarMessage
}

const _default: Required<Messages<SideMessage>> = {
    zh_CN: {
        list: listMessages.zh_CN,
        calendar: calendarMessages.zh_CN,
    },
    en: {
        list: listMessages.en,
        calendar: calendarMessages.en,
    },
    zh_TW: {
        list: listMessages.zh_TW,
        calendar: calendarMessages.zh_TW,
    },
    ja: {
        list: listMessages.ja,
        calendar: calendarMessages.ja,
    },
    pt_PT: {
        list: listMessages.pt_PT,
        calendar: calendarMessages.pt_PT,
    },
    uk: {
        list: listMessages.uk,
        calendar: calendarMessages.uk,
    },
    es: {
        list: listMessages.es,
        calendar: calendarMessages.es,
    },
    de: {
        list: listMessages.de,
        calendar: calendarMessages.de,
    }
}

export default _default