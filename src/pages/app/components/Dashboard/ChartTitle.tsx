import { defineComponent } from "vue"

const _default = defineComponent({
    props: {
        text: String
    },
    setup(props) {
        return () => (
            <div class="dashboard-chart-title">
                <span>{props.text ?? ''}</span>
            </div>
        )
    }
})

export default _default