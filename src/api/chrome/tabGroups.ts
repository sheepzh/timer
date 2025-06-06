export function listAllGroups(): Promise<chrome.tabGroups.TabGroup[]> {
    return chrome.tabGroups.query({})
}