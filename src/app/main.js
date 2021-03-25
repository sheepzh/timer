import Vue from 'vue'
import AppMain from './App'
import './element'
import i18n from '../common/vue-i18n'
import router from './router'
import './styles/index.scss'
import { openLog, closeLog } from '../common/logger'

/**
 * Manually open and close the log
 * 
 * @since 0.0.8
 */
window.timer = { openLog, closeLog }

new Vue({
    el: '#app',
    i18n,
    router,
    render: (h) => h(AppMain)
})