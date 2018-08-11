import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [

        {
            path: '/login',
            // component: require('../components/common/login').default
            component: () => import('../components/common/login'),
        },
        {
            path: '/dashboard',
            // component: require('../components/dashboard/dashboard').default
            component: () => import('../components/dashboard/dashboard')
        },
        {
            path: '/',
            // component: require('../components/dashboard/dashboard').default
            component: () => import('../components/dashboard/dashboard')
        },
        {
            path: '/extraction-list',
            component: () => import('../components/extraction/list'),
        },
        {
            path: '/create-article',
            component: () => import('../components/extraction/create'),
        },
        { path: '*', redirect: '/' },
    ]
})
