/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "../../locale"

const handleClick = (_params: any) => {
    const params = _params as { name: any; componentType: string; seriesType: string }
    const name = params.name
    const componentType = params.componentType
    if (componentType === 'series') {
        // Not the other item
        name !== t(msg => msg.otherLabel)
            // Then open it
            && chrome.tabs.create({ url: `http://${name}` })
    }
}

export default handleClick