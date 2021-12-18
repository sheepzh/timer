/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const handleClick = (_params: any) => {
    console.log(_params)
    const params = _params as { data: any; componentType: string; seriesType: string }
    const host = params.data?.host
    const componentType = params.componentType
    if (componentType === 'series') {
        host && chrome.tabs.create({ url: `http://${host}` })
    }
}

export default handleClick