import { defineComponent } from "vue"
import Chart from "./components/Chart"
import Header from "./components/Header"

const Main = defineComponent(() => {
    return () => <>
        <Header />
        <Chart />
    </>
})

export default Main


