import { App, createApp } from 'vue'
import Main from './app'
import 'element-plus/lib/theme-chalk/index.css'

import './style' // global css

const app: App = createApp(Main)

app.mount('#app')