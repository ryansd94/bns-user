import { getUserInfo } from "helpers"
import { format, formatDistance } from 'date-fns'
import { enCA, ru, vi } from 'date-fns/locale'
import _ from 'lodash'

export const formatDistanceDate = (date, ago = false) => {
    const localDate = new Date(date)
    return formatDistance(localDate, new Date(), { addSuffix: true, locale: enCA })
}

export const formatDate = (value) => {
    return _.isNil(value) ? '' : format(new Date(value), 'dd-MM-yyyy')
}

export const formatDateTime = (value) => {
    return _.isNil(value) ? '' : format(new Date(value), 'dd-MM-yyyy HH:mm')
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
            var deepResult = deepFind(obj[keyChildItem], search, keyChildItem)
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
            var deepResult = deepFind(obj[keyChildItem], search, keyChildItem)
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

export const getPathItem = (url, isProjectPath = true) => {
    let path = url
    if (isProjectPath === true) {
        path = getProjectPath(path)
    }
    const user = getUserInfo()
    if (user) {
        const defaultOrganization = user.defaultOrganization?.code
        path = !_.isNil(defaultOrganization) ? `/${user.defaultOrganization}${path}` : `${path}`
    }
    return path
}

export const setValuesData = (setValue, data) => {
    for (let key in data) {
        setValue(key, data[key])
    }
}