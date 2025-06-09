
export async function listAllGroups(): Promise<chrome.tabGroups.TabGroup[]> {
    try {
        return chrome.tabGroups.query({})
    } catch (e) {
        return []
    }
}

export async function getGroup(id: number | undefined): Promise<chrome.tabGroups.TabGroup | undefined> {
    if (!id) return undefined
    try {
        return chrome.tabGroups.get(id)
    } catch (e) {
        return undefined
    }
}

export function onChanged(handler: ArgCallback<chrome.tabGroups.TabGroup>): void {
    try {
        chrome.tabGroups.onCreated.addListener(handler)
        chrome.tabGroups.onRemoved.addListener(handler)
        chrome.tabGroups.onUpdated.addListener(handler)
    } catch (e) {
        // ignored
    }
}

export function removeChangedHandler(handler: ArgCallback<chrome.tabGroups.TabGroup>): void {
    try {
        chrome.tabGroups.onCreated.removeListener(handler)
        chrome.tabGroups.onRemoved.removeListener(handler)
        chrome.tabGroups.onUpdated.removeListener(handler)
    } catch (e) {
        // ignored
    }
}

export function isValidGroup(groupId?: number): groupId is number {
    if (!groupId) return false
    try {
        return !!groupId && groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE
    } catch {
        return false
    }
}