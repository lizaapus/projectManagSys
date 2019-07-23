import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import axios from 'axios'
import setaxios from './setaxios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

setaxios()
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')