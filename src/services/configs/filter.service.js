import { createInstance, handleError } from "services/base";
import { buildQueryString } from "helpers";
const baseUrl = "/sys_filter";

const services = createInstance("/api");
export const saveFilter = async (param) => {
  try {
    const query = `${baseUrl}`;
    if (!param.id) {
      const res = await services.post(query, param);
      return res;
    } else {
      const res = await services.put(`${baseUrl}/${param.id}`, param);
      return res;
    }
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