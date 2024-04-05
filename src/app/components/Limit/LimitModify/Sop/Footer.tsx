import { t } from "@app/locale"
import { Right, Back, Close, Check } from "@element-plus/icons-vue"
import { ElButton } from "element-plus"
import { defineComponent } from "vue"

const _default = defineComponent({
    props: {
        last: Boolean,
        first: Boolean,
    },
    emits: {
        back: () => true,
        next: () => true,
    },
    setup(props, ctx) {
        return () => <div class="sop-footer">
            <ElButton
                type="info"
                icon={props.first ? <Close /> : <Back />}
                onClick={() => ctx.emit("back")}
            >
                {t(msg => props.first ? msg.button.cancel : msg.button.previous)}
            </ElButton>
            <ElButton
                type={props.last ? "success" : "primary"}
                icon={props.last ? <Check /> : <Right />}
                onClick={() => ctx.emit("next")}
            >
                {t(msg => props.last ? msg.button.save : msg.button.next)}
            </ElButton>
        </div>
    }
})

export default _default