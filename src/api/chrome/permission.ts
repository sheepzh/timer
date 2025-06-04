export async function requestPerm(perm: chrome.runtime.ManifestPermissions): Promise<boolean> {
    const permReq: chrome.permissions.Permissions = { permissions: [perm] }
    const hasOwned = await chrome.permissions.contains(permReq)
    if (hasOwned) return true
    return await chrome.permissions.request({ permissions: [perm] })
}