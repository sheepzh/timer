import { sendMsg2Runtime } from "@api/chrome/runtime"

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