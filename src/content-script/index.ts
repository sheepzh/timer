/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { sendMsg2Runtime } from "@api/chrome/runtime"
import { initLocale } from "@i18n"
import TrackerClient from "@src/background/timer/client"
import processLimit from "./limit"
import { injectPolyfill } from "./polyfill/inject"
import printInfo from "./printer"
import RunTracker from "./tracker/run"

const host = document?.location?.host
const url = document?.location?.href

const FLAG_ID = '__TIMER_INJECTION_FLAG__' + chrome.runtime.id

function getOrSetFlag(): boolean {
    const pre = document?.getElementById(FLAG_ID)
    if (!pre) {
        const flag = document?.createElement('a')
        flag.style && (flag.style.visibility = 'hidden')
        flag && (flag.id = FLAG_ID)

        if (document.readyState === "complete") {
            document?.body?.appendChild(flag)
        } else {
            const oldListener = document.onreadystatechange
            document.onreadystatechange = function (ev) {
                oldListener?.call(this, ev)
                document.readyState === "complete" && document?.body?.appendChild(flag)
            }
        }
    }
    return !!pre
}

/**
 * Wrap for hooks, after the extension reloaded or upgraded, the context of current content script will be invalid
 * And sending messages to the runtime will be failed
 */
export async function trySendMsg2Runtime<Req, Res>(code: timer.mq.ReqCode, data?: Req): Promise<Res> {
    try {
        return await sendMsg2Runtime(code, data)
    } catch {
        // ignored
    }
}

async function main() {
    // Execute in every injections
    const tracker = new TrackerClient({
        onReport: data => trySendMsg2Runtime('cs.trackTime', data),
        onResume: reason => reason === 'idle' && trySendMsg2Runtime('cs.idleChange', false),
        onPause: reason => reason === 'idle' && trySendMsg2Runtime('cs.idleChange', true),
    })
    tracker.init()
    const runTracker = new RunTracker(url)
    runTracker.init()
    sendMsg2Runtime('cs.onInjected')

    // Execute only one time for each dom
    if (getOrSetFlag()) return
    if (!host) return

    const isWhitelist = await sendMsg2Runtime('cs.isInWhitelist', { host, url })
    if (isWhitelist) return

    await initLocale()
    const needPrintInfo = await sendMsg2Runtime('cs.printTodayInfo')
    !!needPrintInfo && printInfo(host)
    injectPolyfill()
    await processLimit(url)

    // Increase visit count at the end
    await sendMsg2Runtime('cs.incVisitCount', { host, url })
}

main()