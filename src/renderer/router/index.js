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
        // 采集库
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
        // 待译库
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
        // 待校库
        {
            path: '/proofreading',
            component: () => import('../components/proofreading/route'),
            children: [
                {
                    path: '/',
                    component: () => import('../components/proofreading/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('../components/proofreading/detail'),
                },
                {
                    path: 'proofread/:id',
                    component: () => import('../components/proofreading/proofread'),
                },
            ],
        },
        // 待编库
        {
            path: '/audit',
            component: () => import('../components/audit/route'),
            children: [
                {
                    path: '/',
                    component: () => import('../components/audit/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('../components/audit/detail'),
                },
                {
                    path: 'audit/:id',
                    component: () => import('../components/audit/audit'),
                },
            ],
        },
        // 成稿库
        {
            path: '/finished',
            component: () => import('../components/finished/route'),
            children: [
                {
                    path: '/',
                    component: () => import('../components/finished/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('../components/finished/detail'),
                },
            ],
        },
        { path: '*', redirect: '/' },
    ]
})
