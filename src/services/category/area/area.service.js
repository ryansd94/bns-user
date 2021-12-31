import { createInstance, handleError } from '../../base';
const baseUrl = '/cf_area';
const services = createInstance('/api');
export const getArea = async param => {
    try {
        const query = `${baseUrl}/GetAllData`;
        const res = await services.post(query, param);
        return res;
    }
    catch (error) {
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
export const postArea = async param => {
    try {
        const query = `${baseUrl}`;
        const res = await services.post(query, param);
        return res;
    }
    catch (error) {
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