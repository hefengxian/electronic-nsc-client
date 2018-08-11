import 'iview/dist/styles/iview.css'

import Vue from 'vue'
import axios from 'axios'
import iView from 'iview'

import App from './App'
import router from './router'
import store from './store'
import LocalStore from './plugin/local-store/'
import Api from './api/'

Vue.use(iView)
Vue.use(LocalStore)
Vue.use(Api)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
