import { log } from "@src/common/logger"

/**
 * Copyright (c) 2022-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
class MessageDispatcher {
    private handlers: Partial<{
        [code in timer.mq.ReqCode]: timer.mq.Handler<any, any>
    }> = {}

    register<Req = any, Res = any>(code: timer.mq.ReqCode, handler: timer.mq.Handler<Req, Res>): MessageDispatcher {
        if (this.handlers[code]) {
            throw new Error("Duplicate handler")
        }
        this.handlers[code] = handler
        return this
    }

    private async handle(message: timer.mq.Request<unknown>): Promise<timer.mq.Response<unknown>> {
        const code = message?.code
        if (!code) {
            return { code: 'ignore' }
        }
        const handler = this.handlers[code]
        if (!handler) {
            return { code: 'ignore' }
        }
        try {
            const result = await handler(message.data)
            return { code: 'success', data: result }
        } catch (error) {
            return { code: 'fail', msg: error }
        }
    }

    start() {
        // Be careful!!!
        // Can't use await/async in callback parameter
        chrome.runtime.onMessage.addListener((message: timer.mq.Request<unknown>, _sender: never, sendResponse: timer.mq.Callback<unknown>) => {
            log('start to handle message', message.code, message.data)
            this.handle(message).then(response => {
                log('the response is', response, message)
                sendResponse(response)
            })
            // 'return ture' will force chrome to wait for the response processed in the above promise.
            // @see https://github.com/mozilla/webextension-polyfill/issues/130
            return true
        })
    }
}

export default MessageDispatcher