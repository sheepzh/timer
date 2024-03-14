/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getMembers, MemberInfo } from "@api/crowdin"
import { t } from "@app/locale"
import { ElDivider } from "element-plus"
import { defineComponent, onMounted, ref } from "vue"

const _default = defineComponent(() => {
    const list = ref<MemberInfo[]>([])
    onMounted(async () => {
        const members = await getMembers() || []
        members.sort((a, b) => (a.joinedAt || "").localeCompare(b.joinedAt || ""))
        list.value = members
    })
    return () => (
        <div class="member-container">
            <ElDivider>{t(msg => msg.helpUs.contributors)}</ElDivider>
            <div>
                {list.value.map(({ avatarUrl, username }) => (
                    <a href={`https://crowdin.com/profile/${username}`} target="_blank">
                        <img src={avatarUrl} alt={username} title={username} />
                    </a>
                ))}
            </div>
        </div>
    )
})

export default _default
