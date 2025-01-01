import limitMessages, { type LimitMessage } from "../app/limit"
import menuMessages, { type MenuMessage } from "../app/menu"
import metaMessages, { type MetaMessage } from "../common/meta"
import { merge, type MessageRoot } from "../merge"
import consoleMessages, { type ConsoleMessage } from "./console"
import modalMessages, { type ModalMessage } from "./modal"

export type CsMessage = {
    console: ConsoleMessage
    modal: ModalMessage
    meta: MetaMessage
    limit: LimitMessage
    menu: MenuMessage
}

const CHILD_MESSAGES: MessageRoot<CsMessage> = {
    console: consoleMessages,
    modal: modalMessages,
    meta: metaMessages,
    limit: limitMessages,
    menu: menuMessages,
}

const _default = merge<CsMessage>(CHILD_MESSAGES)

export default _default