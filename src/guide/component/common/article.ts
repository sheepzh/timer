/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { I18nKey } from "@guide/locale"
import type { PropType } from "vue"
import type { Router } from "vue-router"

import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue"
import { t } from "@guide/locale"
import { defineComponent, h } from "vue"
import { useRouter } from "vue-router"

type Link = {
    route: string
    title: I18nKey
}

function renderFooter(previous: Link, next: Link, router: Router) {
    return h('div', { class: 'article-footer' }, [
        previous && h('div', {
            class: 'previous-container', onClick: () => router.push(previous.route)
        }, [
            h(ArrowLeft),
            h('span', t(previous.title)),
        ]),
        next && h('div', { class: 'next-container', onClick: () => router.push(next.route) }, [
            h('span', t(next.title)),
            h(ArrowRight),
        ])
    ])
}

const _default = defineComponent({
    props: {
        title: {
            type: Function as PropType<I18nKey>,
            required: true,
        },
        next: Object as PropType<Link>,
        previous: Object as PropType<Link>,
    },
    setup(props, ctx) {
        const { previous, next, title } = props
        const router = useRouter()
        const content = ctx.slots.default
        return () => h('div', { class: 'article-container' }, [
            h('h1', { class: 'article-title' }, t(title)),
            content && h('div', { class: 'article-content' }, h(content)),
            (previous || next) && renderFooter(previous, next, router)
        ])
    }
})

export default _default