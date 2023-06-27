/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { randomIntBetween } from "@util/number"
import { VerificationContext, VerificationGenerator, VerificationPair } from "../common"

class UglyGenerator implements VerificationGenerator {
    supports(context: VerificationContext): boolean {
        return context.difficulty === 'hard'
    }

    generate(_: VerificationContext): VerificationPair {
        const min = 1 << 6
        const max = 1 << 8
        const random = randomIntBetween(min, max)
        return {
            answer: random?.toString(2)
        }
    }
}

export default UglyGenerator