import axios from 'axios'
import httpStatus from 'http-status'
import { getAccessToken, resetRefreshTokenFailure } from './../helpers'
import queryString from 'query-string'
import _ from 'lodash'

export const createInstance = (organization = null) => {
    // const { origin } = window && window.location
    const instance = axios.create({
        baseURL: !_.isNil(organization) ? `${process.env.REACT_APP_API_URL}/${organization}/api` : `${process.env.REACT_APP_API_URL}/api`,
        headers: {
            'content-type': 'application/json',
        },
        paramsSerializer: params => queryString.stringify(params),
    })

    instance.interceptors.request.use(request => {
        const token = getAccessToken()
        request.headers.Authorization = `Bearer ${token}`
        return request
    })

    instance.interceptors.response.use(
        response => {
            if (response.status === httpStatus[200]) {
                if (response.data.status === httpStatus[200]) {

                }
                else {

                }
            }
            return response.data
        },
        async error => {
            const originalRequest = error.config
            if (error.response.status === httpStatus.UNAUTHORIZED && !originalRequest._retry) {
                // not working well
                // originalRequest._retry = true
                // return refreshTokenAndRecallRequest(originalRequest)
                // log out 
                resetRefreshTokenFailure()
                //window.location.reload()
            }
            return Promise.reject(error)
        },
    )

    return instance
}
