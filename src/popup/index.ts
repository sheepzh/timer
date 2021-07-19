import 'element-plus/lib/theme-chalk/el-link.css'
import 'element-plus/lib/theme-chalk/el-icon.css'
import 'element-plus/lib/theme-chalk/el-select.css'
import 'element-plus/lib/theme-chalk/el-switch.css'

// Customized css after element's css
import './style' // global css

import renderChart, { handleRestore } from './components/chart'
import initFooter, { queryInfo } from './components/footer'

handleRestore(queryInfo)
initFooter(renderChart)