import axios from 'axios';
import httpStatus from 'http-status';
import { getAccessToken, setRefreshTokenSucceeded, resetRefreshTokenFailure } from './../helpers';

export const createInstance = path => {
    // const { origin } = window && window.location;
    const instance = axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}${path}`,
    });

    instance.interceptors.request.use(request => {
        const token = getAccessToken();
        request.headers.Authorization = `Bearer ${token}`;
        return request;
    });

    instance.interceptors.response.use(
        response => {
            return response;
        },
        async error => {
            const originalRequest = error.config;
            if (error.response.status === httpStatus.UNAUTHORIZED && !originalRequest._retry) {
                // not working well
                // originalRequest._retry = true;
                // return refreshTokenAndRecallRequest(originalRequest);
                // log out 
                resetRefreshTokenFailure();
                //window.location.reload();
            }
            return Promise.reject(error);
        },
    );

    return instance;
};
