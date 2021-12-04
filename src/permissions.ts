/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

function checkPermission(permission: string): Promise<boolean> {
    return new Promise(
        resolve => chrome.permissions.contains({ permissions: [permission] }, (granted: boolean) => resolve(granted))
    )
}

function requestPermission(permission: string): Promise<boolean> {
    return new Promise(
        resolve => chrome.permissions.request({ permissions: [permission] }, (granted: boolean) => resolve(granted))
    )
}

export async function checkOrRequestPermission(permission: string): Promise<boolean> {
    return await checkPermission(permission) || await requestPermission(permission)
}