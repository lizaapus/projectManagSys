import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import FundProManager from './views/FundProManager.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/ProjectManager',
            name: 'ProjectManger',
            component: Home
        },
        {
            path: '/FundProManager',
            name: 'FundProManager',
            component: FundProManager
        }
    ]
})