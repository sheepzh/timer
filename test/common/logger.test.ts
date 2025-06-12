/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { closeLog, log, openLog } from "@src/common/logger"

test('test open log', () => {
    global.console.log = jest.fn()
    openLog()
    log("foobar")
    expect(console.log).toHaveBeenCalledWith("foobar")
})

test('test close log', () => {
    global.console.log = jest.fn()
    closeLog()
    log("foobar")
    expect(console.log).toHaveBeenCalledTimes(0)
})