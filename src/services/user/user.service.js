import { createInstance, handleError } from "services/base";
import { buildQueryString } from "helpers";
const baseUrl = "/jm_user";

const services = createInstance("/api");
export const getUser = async (param) => {
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
export const saveUser = async (param) => {
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



export const updateUserStatus = async (param) => {
  try {
    const query = `${baseUrl}/status`;
    const res = await services.put(query, param);
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
export const signup = async (param) => {
  try {
    const query = `${baseUrl}/signup`;
    const res = await services.post(query, param);
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
export const deleteUser = async (id) => {
  try {
    let query = `${baseUrl}/${id}`;
    const res = await services.delete(query);
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
export const sendMailUser = async (param) => {
  try {
    const query = `${baseUrl}/add-user`;
    const res = await services.post(query, param);
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
export const validateTokenSignup = async (param) => {
  try {
    const query = `${baseUrl}/validate-signup`;
    const res = await services.post(query, param);
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
