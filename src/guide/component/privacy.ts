import { defineComponent } from "vue"
import { h1, h2, list, paragraph, section } from "./common"

const _default = defineComponent({
    setup() {
        return () => section(
            h1(msg => msg.layout.menu.privacy.title, 'privacy'),
            h2(msg => msg.layout.menu.privacy.scope, 'scope'),
            paragraph(msg => msg.privacy.scope.p1),
            list(
                msg => msg.privacy.scope.l1,
                msg => msg.privacy.scope.l2,
                msg => msg.privacy.scope.l3,
            ),
            h2(msg => msg.layout.menu.privacy.storage, 'storage'),
            paragraph(msg => msg.privacy.storage.p1),
            paragraph(msg => msg.privacy.storage.p2),
            paragraph(msg => msg.privacy.storage.p3),
        )
    }
})

export default _default