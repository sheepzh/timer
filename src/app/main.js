import Vue from 'vue'
import AppMain from './App'
import './element'
import i18n from '../common/vue-i18n'
import router from './router'
import './styles/index.scss'

new Vue({
    el: '#app',
    i18n,
    router,
    render: (h) => h(AppMain)
})