import { IS_MV3 } from "@util/constant/environment"
import { handleError } from "./common"

function onClick(id: string, handler: Function) {
    chrome.contextMenus.onClicked.addListener(({ menuItemId }) => menuItemId === id && handler?.())
}

export function createContextMenu(props: ChromeContextMenuCreateProps): Promise<void> {
    let clickHandler: Function = undefined
    if (IS_MV3) {
        clickHandler = props.onclick
        delete props.onclick
    }
    return new Promise(resolve => chrome.contextMenus.create(props, () => {
        handleError('createContextMenu')
        clickHandler && onClick(props.id, clickHandler)
        resolve()
    }))
}

export function updateContextMenu(menuId: string, props: ChromeContextMenuUpdateProps): Promise<void> {
    return new Promise(resolve => chrome.contextMenus.update(menuId, props, () => {
        handleError('updateContextMenu')
        resolve()
    }))
}