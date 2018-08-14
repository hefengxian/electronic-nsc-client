/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-08-08 18-07
 * @version 1.0
 */

import api from './api-client'

const PREFIX = '/v1/translation/'

export default {
    list(params) {
        return api.doRequest(PREFIX + 'list', api.GET, params)
    },
    count(params) {
        return api.doRequest(PREFIX + 'count', api.GET, params)
    },
    articles(params) {
        return api.doRequest(PREFIX + 'articles', api.GET, params)
    },
    detail(params) {
        return api.doRequest(PREFIX + 'detail', api.GET, params)
    },
    translate(data) {
        return api.doRequest(PREFIX + 'translate', api.POST, null, data)
    },
    status(data) {
        return api.doRequest(PREFIX + 'status', api.PUT, null, data)
    },
    save(data) {
        return api.doRequest(PREFIX + 'save', api.PUT, null, data)
    },
}