import { createInstance, handleError } from "services/base"
import { buildQueryString, getUserInfo } from "helpers"
import { EStatusResponse } from 'configs/enums'
import _ from 'lodash'


export const save = async (baseUrl, param) => {
  const user = getUserInfo()
  const services = createInstance(user.defaultOrganization)
  try {
    const query = `${baseUrl}`
    if (_.isEmpty(param.id)) {
      const res = await services.post(query, param)
      return res
    } else {
      const res = await services.put(`${baseUrl}/${param.id}`, param)
      return res
    }
  } catch (error) {
    const { request, response } = error
    if (request) {
      return request
    }
    if (response) {
      return response
    }
    return error
  }
}

export const get = async (baseUrl, param = null) => {
  const user = getUserInfo()
  const services = createInstance(user.defaultOrganization)
  try {
    let query = `${baseUrl}`
    if (param) {
      query += buildQueryString(param)
    }
    const res = await services.get(query)
    return res
  } catch (error) {
    const { request, response } = error
    if (response) {
      if (response.status === EStatusResponse.unauthorized) {
        window.location.href = "http://localhost:3000/login";
      }
      return null
    }
    return error
  }
}

export const getByID = async (baseUrl, id) => {
  const user = getUserInfo()
  const services = createInstance(user.defaultOrganization)
  try {
    let query = `${baseUrl}/${id}`
    const res = await services.get(query)
    return res
  } catch (error) {
    const { request, response } = error
    if (request) {
      return request
    }
    if (response) {
      return response
    }
    return error
  }
}

export const deleteData = async (baseUrl, id) => {
  const user = getUserInfo()
  const services = createInstance(user.defaultOrganization)
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
}

export const post = async (baseUrl, param) => {
  const user = getUserInfo()
  const services = createInstance(user.defaultOrganization)
  try {
    const query = `${baseUrl}`
    const res = await services.post(query, param)
    return res
  } catch (error) {
    const { request, response } = error
    if (request) {
      return request
    }
    if (response) {
      return response
    }
    return error
  }
}