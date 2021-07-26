import OptionDatabase from "../database/option-database"
import { defaultValue } from '../util/constant/option'

const db = new OptionDatabase(chrome.storage.local)

async function getPopupMax(): Promise<number> {
    const exist: Partial<Timer.Option> = await db.getOption()
    return exist.popupMax || defaultValue().popupMax
}

async function setPopupMax(max: number): Promise<void> {
    const exist: Partial<Timer.Option> = await db.getOption()
    exist.popupMax = max
    const toSet = defaultValue()
    Object.entries(exist).forEach(([key, val]) => toSet[key] = val)
    toSet.popupMax = max
    await db.setOption(toSet)
}

class OptionService {
    getPopupMax = getPopupMax
    setPopupMax = setPopupMax
}

export default new OptionService()