import OptionDatabase from "../database/option-database"
import { defaultValue } from '../util/constant/option'

const db = new OptionDatabase(chrome.storage.local)

async function getPopupOption(): Promise<Timer.PopupOption> {
    const exist: Partial<Timer.Option> = await db.getOption()
    const defaultOption: Timer.PopupOption = defaultValue() as Timer.PopupOption
    Object.entries(exist).forEach(([key, val]) => defaultOption[key] = val)
    return defaultOption
}

async function setPopupOption(option: Timer.PopupOption): Promise<void> {
    const exist: Partial<Timer.Option> = await db.getOption()
    const toSet = defaultValue()
    Object.entries(exist).forEach(([key, val]) => toSet[key] = val)
    Object.entries(option).forEach(([key, val]) => toSet[key] = val)
    await db.setOption(toSet)
}

class OptionService {
    getPopupOption = getPopupOption
    setPopupOption = setPopupOption
}

export default new OptionService()