import { createInstance, handleError } from "services/base";
import { buildQueryString, getUserInfo, resetUserToken } from "helpers";
import { EStatusResponse, EErrorCodeResponse, baseUrl } from "configs";
import _ from "lodash";
import axios from "axios";

export const save = async (baseUrl, param) => {
  const user = getUserInfo();
  validateUser(user);
  const services = createInstance(user.defaultOrganization);
  try {
    const query = `${baseUrl}`;
    if (_.isEmpty(param.id)) {
      const res = await services.post(query, param);
      return res;
    } else {
      const res = await services.put(`${baseUrl}/${param.id}`, param);
      return res;
    }
  } catch (error) {
    const { request, response } = error;
    if (response) {
      validateResponse(response);
      return response;
    }
    return error;
  }
};

export const save2 = async (baseUrl, param) => {
  const user = getUserInfo();
  validateUser(user);
  const services = createInstance(user.defaultOrganization);
  try {
    const query = `${baseUrl}`;
    if (_.isEmpty(param.id)) {
      const res = await services.post(query, param);
      return res;
    } else {
      // let editParam = _.cloneDeep({ changeFields: param.changeFields })
      const res = await services.put(`${baseUrl}/${param.id}`, param);
      return res;
    }
  } catch (error) {
    const { request, response } = error;
    if (response) {
      validateResponse(response);
      return response;
    }
    return error;
  }
};

export const get = async (baseUrl, param = null, cancelToken = null) => {
  const user = getUserInfo();
  validateUser(user);
  const services = createInstance(user.defaultOrganization);
  try {
    let query = `${baseUrl}`;
    if (param) {
      query += buildQueryString(param);
    }
    const res = await services.get(query, {
      token: cancelToken?.current?.token,
    });
    return res;
  } catch (error) {
    const { request, response } = error;
    if (response) {
      validateResponse(response);
      return null;
    }
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching data:", error);
    }
    return error;
  }
};

export const getByID = async (baseUrl, id) => {
  const user = getUserInfo();
  validateUser(user);
  const services = createInstance(user.defaultOrganization);
  try {
    let query = `${baseUrl}/${id}`;
    const res = await services.get(query);
    return res;
  } catch (error) {
    const { request, response } = error;
    if (response) {
      validateResponse(response);
      return response;
    }
    return error;
  }
};

export const deleteData = async (baseUrl, id) => {
  const user = getUserInfo();
  validateUser(user);
  const services = createInstance(user.defaultOrganization);
  try {
    let query = `${baseUrl}`;
    const res = await services.put(query, { ids: id });
    return res;
  } catch (error) {
    const { request, response } = error;
    if (response) {
      validateResponse(response);
      return response;
    }
    return error;
  }
};

export const post = async (baseUrl, param) => {
  const user = getUserInfo();
  validateUser(user);
  const services = createInstance(user.defaultOrganization);
  try {
    const query = `${baseUrl}`;
    const res = await services.post(query, param);
    return res;
  } catch (error) {
    const { request, response } = error;
    if (response) {
      validateResponse(response);
      return response;
    }
    return error;
  }
};

export const put = async (baseUrl, param) => {
  const user = getUserInfo();
  validateUser(user);
  const services = createInstance(user.defaultOrganization);
  try {
    const query = `${baseUrl}/${param.id}`;
    const res = await services.put(query, param);
    return res;
  } catch (error) {
    const { request, response } = error;
    if (response) {
      validateResponse(response);
      return response;
    }
    return error;
  }
};

export const validateResponse = (response) => {
  if (response.status === EStatusResponse.unauthorized) {
    if (response.errorCode === EErrorCodeResponse.notPermission) {
      window.location.href = `${process.env.REACT_APP_DOMAIN}/access-denied`;
    } else {
      resetUserToken();
      window.location.href = `${process.env.REACT_APP_DOMAIN}/login`;
    }
  }
  return;
};

export const validateUser = (user) => {
  // if (_.isEmpty(user)) {
  //   window.location.href = `${process.env.REACT_APP_DOMAIN}/login`;
  //   return;
  // }
};

export const saveUserSetting = async (configs) => {
  const userInfo = getUserInfo()
  await save(`${baseUrl.jm_user}/me`, {
    id: userInfo.userId,
    configs: configs,
  });
}