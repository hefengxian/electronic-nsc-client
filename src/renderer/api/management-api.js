/**
 * Copyright © 2018-present, Knowlesys Ltd.
 * All rights reserved.
 *
 * @author: HFX 2018-08-08 18-07
 * @version 1.0
 */

import api from './api-client'

const PREFIX = '/v1/management/'

export default {
    user: {
        list(params) {
            return api.doRequest(PREFIX + 'user/list', api.GET, params)
        },
        create(data) {
            return api.doRequest(PREFIX + 'user/create', api.POST, {}, data)
        },
        edit(data) {
            return api.doRequest(PREFIX + 'user/edit', api.PUT, {}, data)
        },
        delete(params) {
            return api.doRequest(PREFIX + 'user/delete', api.DELETE, params)
        },
        checkAccount(params) {
            return api.doRequest(PREFIX + 'user/check-account', api.GET, params)
        },
    },
    workGroup: {
        list(params) {
            return api.doRequest(PREFIX + 'work-group/list', api.GET, params)
        },
        create(data) {
            return api.doRequest(PREFIX + 'work-group/create', api.POST, {}, data)
        },
        edit(data) {
            return api.doRequest(PREFIX + 'work-group/edit', api.PUT, {}, data)
        },
        delete(params) {
            return api.doRequest(PREFIX + 'work-group/delete', api.DELETE, params)
        },
    },
}