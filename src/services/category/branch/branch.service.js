import { createInstance, handleError } from '../../base';

import { getShopIndex } from '../../../helpers'
const baseUrl = '/cf_branch';
const services = createInstance('/api');
export const get = async () => {
    try {
        const query = `${baseUrl}/GetAllData`;
        const res = await services.post(query, {
            draw: 0,
            start: 0,
            length: 1000,
            shopIndex: getShopIndex(),
        });
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