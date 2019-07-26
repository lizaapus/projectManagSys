import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
}).$mount('#app')
Vue.use(VueRouter)
Vue.use(VueResource)