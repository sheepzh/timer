import Vue from 'vue'
import Popup from './AppMain'
import './element'
// import './echart'
import i18n from './i18n'

new Vue({
    el: '#app',
    i18n,
    render: (h) => h(Popup),
})