import { createInstance, handleError } from "../../base";
import { buildQueryString } from "helpers";
const baseUrl = "/jm_team";

const services = createInstance("/api");
export const getTeam = async (param) => {
  try {
    let query = `${baseUrl}`;
    if (param) {
      query += buildQueryString(param);
    }
    const res = await services.get(query);
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
export const getTeamByID = async (id) => {
  try {
    let query = `${baseUrl}/${id}`;
    const res = await services.get(query);
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
export const save = async (param, url) => {
  try {
    const query = `${url}`;
    if (!param.id) {
      const res = await services.post(query, param);
      return res;
    } else {
      const res = await services.put(`${url}/${param.id}`, param);
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
