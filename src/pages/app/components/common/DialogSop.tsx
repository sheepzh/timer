import { t } from "@app/locale"
import { Back, Check, Close, Right } from "@element-plus/icons-vue"
import Flex from "@pages/components/Flex"
import { ElButton } from "element-plus"
import { defineComponent, h } from "vue"
import "./dialog-sop.sass"

export type SopStepInstance<T> = {
    parseData: () => Promise<T> | T
}

export type SopInstance = {
    init: () => void
}

const DialogSop = defineComponent({
    props: {
        first: Boolean,
        last: Boolean,
        nextLoading: Boolean,
        finishLoading: Boolean,
    },
    emits: {
        back: () => true,
        next: () => true,
        cancel: () => true,
        finish: () => true,
    },
    setup(props, ctx) {
        const { steps, content } = ctx.slots

        return () => (
            <Flex
                column
                align="center"
                gap={40}
                style={{ marginTop: '25px' }}
            >
                <div class="dialog-sop-step-container">
                    {!!steps && h(steps)}
                </div>
                <div style={{ padding: '0 20px', boxSizing: 'border-box', width: '100%' }}>
                    {!!content && h(content)}
                </div>
                <Flex>
                    <Flex>
                        {props.first ? (
                            <ElButton type="info" icon={<Close />} onClick={() => ctx.emit("cancel")}>
                                {t(msg => msg.button.cancel)}
                            </ElButton>
                        ) : (
                            <ElButton type="info" icon={<Back />} onClick={() => ctx.emit("back")}>
                                {t(msg => msg.button.previous)}
                            </ElButton>
                        )}{
                            props.last ? (
                                <ElButton
                                    type='success'
                                    icon={<Check />}
                                    onClick={() => ctx.emit("finish")}
                                    loading={props.finishLoading}
                                >
                                    {t(msg => msg.button.save)}
                                </ElButton>
                            ) : (
                                <ElButton
                                    type="primary"
                                    icon={<Right />}
                                    onClick={() => ctx.emit("next")}
                                    loading={props.nextLoading}
                                >
                                    {t(msg => msg.button.next)}
                                </ElButton>
                            )
                        }
                    </Flex>
                </Flex>
            </Flex>
        )
    }
})

export default DialogSop