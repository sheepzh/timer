/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getMembers, MemberInfo } from "@api/crowdin"
import { t } from "@app/locale"
import { ElDivider } from "element-plus"
import { defineComponent, h, onMounted, Ref, ref } from "vue"

async function queryData(listRef: Ref<MemberInfo[]>) {
    const list = await getMembers() || []
    list.sort((a, b) => (a.joinedAt || "").localeCompare(b.joinedAt || ""))
    listRef.value = list
}

function renderMember({ avatarUrl, username }: MemberInfo) {
    const img = h('img', { src: avatarUrl, alt: username, title: username })
    const url = `https://crowdin.com/profile/${username}`
    return h('a', { href: url, target: '_blank' }, img)
}

const _default = defineComponent({
    name: 'HelpUsProgressList',
    setup() {
        const list: Ref<MemberInfo[]> = ref([])
        onMounted(() => queryData(list))
        return () => h('div', { class: 'member-container' }, [
            h(ElDivider, {}, () => t(msg => msg.helpUs.contributors)),
            h('div', list.value.map(renderMember))
        ])
    },
})

export default _default