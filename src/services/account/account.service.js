import axios from 'axios';
import { createInstance } from '../base';
import { getRefreshToken, getUserInfo, resetRefreshTokenFailure } from '../../helpers';
const baseUrl = `${process.env.REACT_APP_API_URL}/api/account`;

export const login = async data => {
    try {
        console.log(process.env);
        const res = await axios.post(`${baseUrl}/authenticate`, data);
        return res;
    } catch (error) {
        const { request, response } = error;
        if (request) {
            return request;
        }
        if (response) {
            return response;
        }
        return error;
    }
};
