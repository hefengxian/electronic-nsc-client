/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-08-08 18-07
 * @version 1.0
 */

import api from './api-client'

const PREFIX = '/v1/extraction/'

export default {
    list(params) {
        return api.doRequest(PREFIX + 'list', api.GET, params)
    },
    count(params) {
        return api.doRequest(PREFIX + 'count', api.GET, params)
    },
    create(data) {
        return api.doRequest(PREFIX + 'create', api.POST, null, data)
    },
}