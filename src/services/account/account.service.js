import axios from 'axios';
import { createInstance } from '../base';
import { getRefreshToken, getUserInfo, resetRefreshTokenFailure } from '../../helpers';
const baseUrl = `${process.env.REACT_APP_API_URL}/api/account`;

export const login = async data => {
    try {
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

export const loginGoogle = async data => {
    try {
        const res = await axios.post(`${baseUrl}/login-google`, data);
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

export const registerGoogle = async (param) => {
    try {
      const query = `${baseUrl}/register-google`;
      const res = await axios.post(query, param);
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