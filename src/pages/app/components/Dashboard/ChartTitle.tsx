import { defineComponent } from "vue"

const _default = defineComponent<{ text: string }>(props => {
    return () => (
        <div class="dashboard-chart-title">
            <span>{props.text ?? ''}</span>
        </div>
    )
}, { props: ['text'] })

export default _default