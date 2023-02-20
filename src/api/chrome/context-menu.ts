import { handleError } from "./common"

export function createContextMenu(props: ChromeContextMenuCreateProps): Promise<void> {
    return new Promise(resolve => chrome.contextMenus.create(props, () => {
        handleError('createContextMenu')
        resolve()
    }))
}

export function updateContextMenu(menuId: string, props: ChromeContextMenuUpdateProps): Promise<void> {
    return new Promise(resolve => chrome.contextMenus.update(menuId, props, () => {
        handleError('updateContextMenu')
        resolve()
    }))
}