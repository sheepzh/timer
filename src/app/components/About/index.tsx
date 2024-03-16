import { defineComponent } from "vue"
import ContentContainer from "../common/content-container"
import Description from "./Description"

const _default = defineComponent({
    setup() {
        return () => (
            <ContentContainer>
                <Description />
            </ContentContainer>
        )
    }
})

export default _default