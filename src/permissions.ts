/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

export function checkPermission(permission: string): Promise<boolean> {
    return new Promise(
        resolve => chrome.permissions.contains({ permissions: [permission] }, (granted: boolean) => resolve(granted))
    )
}

export function requestPermission(permission: string): Promise<boolean> {
    return new Promise(
        resolve => chrome.permissions.request({ permissions: [permission] }, (granted: boolean) => resolve(granted))
    )
}
