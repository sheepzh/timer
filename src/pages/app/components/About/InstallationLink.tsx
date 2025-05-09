import { defineComponent } from "vue"
import "./installation-link.sass"
import Flex from "@pages/components/Flex"

type _Source = 'chrome' | 'firefox' | 'edge' | 'kiwi'

const _default = defineComponent<{ source: _Source, name: string, href: string }>(({ source, name, href }) => {
    return () => (
        <Flex justify="center" boxSizing="border-box" class="installation-link-container">
            <a href={href} target="_blank" class="installation-link">
                <div class={`i-logos i-logos-${source}`} />
                <span class="installation-name">{name}</span>
            </a>
        </Flex>
    )
}, { props: ['source', 'name', 'href'] })

export default _default