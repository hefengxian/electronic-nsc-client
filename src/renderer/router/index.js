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
            path: '/extraction',
            component: () => import('../components/extraction/route'),
            children: [
                {
                    path: '/',
                    component: () => import('../components/extraction/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('../components/extraction/detail'),
                },
                {
                    path: 'edit/:id',
                    component: () => import('../components/extraction/edit'),
                },
                {
                    path: 'create',
                    component: () => import('../components/extraction/create'),
                },
            ],
        },
        {
            path: '/translation',
            component: () => import('../components/translation/route'),
            children: [
                {
                    path: '/',
                    component: () => import('../components/translation/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('../components/translation/detail'),
                },
                {
                    path: 'translate/:id',
                    component: () => import('../components/translation/translate'),
                },
            ],
        },
        { path: '*', redirect: '/' },
    ]
})
