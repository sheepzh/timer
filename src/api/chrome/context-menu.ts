import { IS_ANDROID } from "@util/constant/environment"
import { handleError } from "./common"

function onClick(id: string, handler: Function) {
    if (IS_ANDROID) {
        return
    }
    chrome.contextMenus?.onClicked?.addListener(({ menuItemId }) => menuItemId === id && handler?.())
}

export function createContextMenu(props: ChromeContextMenuCreateProps): Promise<void> {
    if (IS_ANDROID) {
        return
    }
    // Add listener by param
    let clickHandler: Function = undefined
    clickHandler = props.onclick
    delete props.onclick

    return new Promise(resolve => chrome.contextMenus?.create?.(props, () => {
        handleError('createContextMenu')
        clickHandler && onClick(props.id, clickHandler)
        resolve()
    }))
}

export function updateContextMenu(menuId: string, props: ChromeContextMenuUpdateProps): Promise<void> {
    if (IS_ANDROID) {
        return
    }
    return new Promise(resolve => chrome.contextMenus?.update?.(menuId, props, () => {
        handleError('updateContextMenu')
        resolve()
    }))
}