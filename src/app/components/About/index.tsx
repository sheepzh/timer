import { defineComponent } from "vue"
import ContentContainer from "../common/ContentContainer"
import Description from "./Description"

const _default = defineComponent({
    render: () => (
        <ContentContainer>
            <Description />
        </ContentContainer>
    )
})

export default _default