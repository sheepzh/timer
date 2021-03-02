import Vue from 'vue'
import ECharts from 'vue-echarts'

// import ECharts modules manually to reduce bundle size
// import {
//     CanvasRenderer
// } from 'echarts/renderers'
// import {
//     BarChart
// } from 'echarts/charts'
// import {
//     GridComponent,
//     TooltipComponent
// } from 'echarts/components'

// Register globally
Vue.component('v-chart', ECharts)