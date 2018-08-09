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

const api = {
    ...apiClient,
    dashboard,
    public: publicApi,
    system,
}

export default api