

import Moment from 'moment'
import _ from 'lodash'

export const formatDate = (value) => {
    return _.isNil(value) ? '' : Moment(value).format('DD-MM-YYYY')
}

export const formatDateTime = (value) => {
    return _.isNil(value) ? '' : Moment(value).format('DD-MM-YYYY HH:mm')
}

export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const cellFormatDate = (params) => {
    return formatDate(params.value)
}

export const cellFormatDateTime = (params) => {
    return formatDateTime(params.value)
}

export const deepFind = (arr, search) => {
    for (var obj of arr) {
        if (search(obj)) {
            return obj
        }
        if (obj.childrens) {
            var deepResult = deepFind(obj.childrens, search)
            if (deepResult) {
                return deepResult
            }
        }
    }
    return null
}