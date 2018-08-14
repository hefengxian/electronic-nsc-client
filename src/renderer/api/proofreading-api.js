/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-08-08 18-07
 * @version 1.0
 */

import api from './api-client'

const PREFIX = '/v1/proofreading/'

export default {
    articles(params) {
        return api.doRequest(PREFIX + 'articles', api.GET, params)
    },
    detail(params) {
        return api.doRequest(PREFIX + 'detail', api.GET, params)
    },
    status(data) {
        return api.doRequest(PREFIX + 'status', api.PUT, null, data)
    },
    save(data) {
        return api.doRequest(PREFIX + 'save', api.PUT, null, data)
    },
}