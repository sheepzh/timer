/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { randomIntBetween } from "@util/number"
import { VerificationContext, VerificationGenerator, VerificationPair } from "../common"
import { rangeArr } from "element-plus"

const BASE = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\`-=[]/.,:\"<>?!@#$%^&*()_+;'"
const BASE_LEN = BASE.length

class UglyGenerator implements VerificationGenerator {
    supports(context: VerificationContext): boolean {
        return context.difficulty === 'hard'
    }

    generate(_: VerificationContext): VerificationPair {
        const len = randomIntBetween(16, 20)
        const answer = rangeArr(len)
            .map(() => randomIntBetween(0, BASE_LEN))
            .map(decimal => BASE.charAt(decimal))
            .join('')

        return { answer }
    }
}

export default UglyGenerator