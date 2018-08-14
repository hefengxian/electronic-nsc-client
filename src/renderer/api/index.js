/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-08-09 19-05
 * @version 1.0
 */

import apiClient from './api-client'
import dashboard  from './dashboard-api'
import publicApi from './public-api'
import system from './system-api'
import extraction from './extraction-api'
import translation from './translation-api'
import proofreading from './proofreading-api'
import audit from './audit-api'
import finished from './finished-api'
import management from './management-api'
import personal from './personal-api'

const api = {
    ...apiClient,
    dashboard,
    public: publicApi,
    system,
    extraction,
    translation,
    proofreading,
    audit,
    finished,
    management,
    personal,
}

export default {
    // ...api,
    // 可以作为 Vue 插件
    install(Vue, options) {
        Vue.api = api
        Vue.prototype.$api = api
    }
}
