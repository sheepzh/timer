import { Locale } from ".."
import compile from "./compile"
import messages from "./message"

const _default: { [locale in Locale]: any } = {
    zh_CN: compile(messages.zh_CN),
    en: compile(messages.en),
    ja: compile(messages.ja)
}

export default _default