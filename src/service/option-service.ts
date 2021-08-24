import OptionDatabase from "../database/option-database"
import { defaultAppearance, defaultPopup } from "../util/constant/option"

const db = new OptionDatabase(chrome.storage.local)

const defaultOption = () => {
    return { ...defaultAppearance(), ...defaultPopup() }
}

async function getAllOption(): Promise<Timer.Option> {
    const exist: Partial<Timer.Option> = await db.getOption()
    const result: Timer.Option = defaultOption()
    Object.entries(exist).forEach(([key, val]) => result[key] = val)
    return result
}

async function setPopupOption(option: Timer.PopupOption): Promise<void> {
    await setOption(option)
}

async function setAppearanceOption(option: Timer.AppearanceOption): Promise<void> {
    await setOption(option)
}

async function setOption(option: Partial<Timer.Option>): Promise<void> {
    const exist: Partial<Timer.Option> = await db.getOption()
    const toSet = defaultOption()
    Object.entries(exist).forEach(([key, val]) => toSet[key] = val)
    Object.entries(option).forEach(([key, val]) => toSet[key] = val)
    await db.setOption(toSet)
}

class OptionService {
    getAllOption = getAllOption
    setPopupOption = setPopupOption
    setAppearanceOption = setAppearanceOption
    addOptionChangeListener = db.addOptionChangeListener
}

export default new OptionService()