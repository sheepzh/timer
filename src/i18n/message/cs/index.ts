import { merge } from "../merge"
import limitMessages, { LimitMessage } from "../app/limit"
import metaMessages, { MetaMessage } from "../common/meta"
import consoleMessages, { ConsoleMessage } from "./console"
import modalMessages, { ModalMessage } from "./modal"
import menuMessages, { MenuMessage } from "../app/menu"

export type CsMessage = {
    console: ConsoleMessage
    modal: ModalMessage
    meta: MetaMessage
    limit: LimitMessage
    menu: MenuMessage
}

const CHILD_MESSAGES: { [key in keyof CsMessage]: Messages<CsMessage[key]> } = {
    console: consoleMessages,
    modal: modalMessages,
    meta: metaMessages,
    limit: limitMessages,
    menu: menuMessages,
}

const _default = merge<CsMessage>(CHILD_MESSAGES)

export default _default