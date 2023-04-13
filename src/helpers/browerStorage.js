/* eslint-disable import/prefer-default-export */
import { LOCAL_STORAGE_KEYS } from '../configs';

export const getAccessToken = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
};

export const getShopIndex = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.shopIndex);
};

export const getRefreshToken = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.refreshToken);
};

export const getUserInfo = () => {
    const user = localStorage.getItem(LOCAL_STORAGE_KEYS.user);
    return user ? JSON.parse(user) : {};
};

export const getLanguage = () => {
    const language = localStorage.getItem(LOCAL_STORAGE_KEYS.i18nextLng);
    return language ? language : null;
}

export const setTokenLoginSucceeded = ({ token, user }) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.user, JSON.stringify(user));
    localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, token.accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, token.refreshToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.shopIndex, token.shopIndex);
}

export const getKeepMeUser = () => {
    return { username: localStorage.getItem(LOCAL_STORAGE_KEYS.userName), password: localStorage.getItem(LOCAL_STORAGE_KEYS.password) }
}

export const setKeepMeUser = ({ user, password }) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.userName, user)
    localStorage.setItem(LOCAL_STORAGE_KEYS.password, password)
}

export const setUserInfo = ({ user }) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.user, JSON.stringify(user))
}

export const setRefreshTokenSucceeded = data => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, data.accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, data.refreshToken);
};

export const resetUserToken = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.user, '');
    localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, '');
    localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, '');
};

export const resetRefreshTokenFailure = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.user, '');
    localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, '');
    localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, '');
    localStorage.setItem(LOCAL_STORAGE_KEYS.courses, '');
    localStorage.setItem(LOCAL_STORAGE_KEYS.i18nextLng, '');
};

export const setIsTokenRefreshing = value => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.isTokenRefreshing, value.toString());
};
