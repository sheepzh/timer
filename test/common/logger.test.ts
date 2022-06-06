/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { openLog, log, closeLog } from "@src/common/logger"

test('test open log', () => {
    global.console.log = jest.fn()
    openLog()
    log("foobar")
    expect(console.log).toBeCalledWith("foobar")
})

test('test close log', () => {
    global.console.log = jest.fn()
    closeLog()
    log("foobar")
    expect(console.log).toBeCalledTimes(0)
})