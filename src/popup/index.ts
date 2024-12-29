/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { initLocale } from "@i18n"
import metaService from "@service/meta-service"
import optionService from "@service/option-service"
import { toggle } from "@util/dark-mode"
import { createApp } from "vue"
import "../common/timer"
import Main from "./Main"
import { FrameRequest, FrameResponse } from "./message"
import "./style"

function send2ParentWindow(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const stamp = Date.now()
            window.onmessage = (ev: MessageEvent) => {
                const resStamp = (ev.data as FrameResponse)?.stamp
                resStamp === stamp && resolve()
            }
            const req: FrameRequest = { stamp, data }
            window.parent.postMessage(req)

            setTimeout(resolve, 1000)
        } catch (e) {
            reject(e)
        }
    })
}

async function main() {
    await initLocale()

    const isDarkMode = await optionService.isDarkMode()
    toggle(isDarkMode)
    await send2ParentWindow('themeInitialized')

    const el = document.createElement('div')
    el.id = 'app'
    document.body.append(el)

    const app = createApp(Main)
    app.mount(el)
    document.body.append(el)

    metaService.increasePopup()
}

main()
