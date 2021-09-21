import 'element-plus/theme-chalk/index.css'

// Customized css after element's css
import './style' // global css

import renderChart, { handleRestore } from './components/chart'
import initFooter, { queryInfo } from './components/footer'

handleRestore(queryInfo)
initFooter(renderChart)