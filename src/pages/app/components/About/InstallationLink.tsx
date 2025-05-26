import Flex from "@pages/components/Flex"
import type { FunctionalComponent } from "vue"
import "./installation-link.sass"

type _Source = 'chrome' | 'firefox' | 'edge' | 'kiwi'

type Props = { source: _Source, name: string, href: string }

const InstallationLink: FunctionalComponent<Props> = ({ href, source }) => (
    <Flex justify="center" boxSizing="border-box" class="installation-link-container">
        <a href={href} target="_blank" class="installation-link">
            <div class={`i-logos i-logos-${source}`} />
            <span class="installation-name">{name}</span>
        </a>
    </Flex>
)

export default InstallationLink