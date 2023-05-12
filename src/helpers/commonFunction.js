import Moment from 'moment'
import { getUserInfo } from "helpers"
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

export const deepFind = (arr, search, keyChildItem = 'childrens') => {
    for (var obj of arr) {
        if (search(obj)) {
            return obj
        }
        if (obj[keyChildItem]) {
            var deepResult = deepFind(obj[keyChildItem], search)
            if (deepResult) {
                return deepResult
            }
        }
    }
    return null
}

export const deepFindAll = (arr, search, keyChildItem = 'childrens') => {
    let data = []
    for (var obj of arr) {
        if (search(obj)) {
            data.push(obj)
        }
        if (obj[keyChildItem]) {
            var deepResult = deepFind(obj[keyChildItem], search)
            if (deepResult) {
                data.push(deepResult)
            }
        }
    }
    return data
}

export const convertObjectToArray = (objectData, objectKeyName = 'key', objectDataName = 'value') => {
    return Object.keys(objectData).map(function (name) {
        var obj = {}
        obj[objectKeyName] = name
        obj[objectDataName] = objectData[name]
        return obj
    })
}

export const getLastPathUrl = () => {
    let path = window.location.pathname
    if (_.includes(path, '/')) {
        const pathSplits = path.split('/')
        path = pathSplits[pathSplits.length - 1]
    }
    return path
}

export const getProjectPath = (path) => {
    const user = getUserInfo()
    if (user) {
        const code = user?.setting?.projectSetting?.current
        return `/${code}${path}`
    }
    return path
}