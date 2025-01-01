/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { randomIntBetween } from "@util/number"
import { type VerificationContext, type VerificationGenerator, type VerificationPair } from "../common"

const UNCOMMON_WORDS = '龘靐齉齾爩鱻麤龗灪吁龖厵滟爨癵籱饢驫鲡鹂鸾麣纞虋讟钃骊郁鸜麷鞻韽韾响顟顠饙饙騳騱饐'
const LENGTH = UNCOMMON_WORDS.length

class UncommonChinese implements VerificationGenerator {
    supports(context: VerificationContext): boolean {
        return context.difficulty === 'disgusting' && context.locale === 'zh_CN'
    }

    generate(_: VerificationContext): VerificationPair {
        let answer = ''
        while (answer.length < 3) {
            const idx = randomIntBetween(0, LENGTH)
            const ch = UNCOMMON_WORDS[idx]
            if (!answer.includes(ch)) {
                answer += ch
            }
        }
        return {
            answer
        }
    }
}

export default UncommonChinese