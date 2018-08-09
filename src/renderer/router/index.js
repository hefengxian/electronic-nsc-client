import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/landing-page',
            name: 'landing-page',
            // component: require('@/components/LandingPage').default
            component: () => import('../components/LandingPage')
        },
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
    ]
})
