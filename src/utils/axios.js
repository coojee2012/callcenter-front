import axios from 'axios';

import { BASE_URL } from '@/utils/constant';
import { responseCodePush } from '@/utils/common';

axios.defaults.withCredentials = true; // 设置默认添加cookie

export const loginServer = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  //withCredentials: true,
  // credentials: false,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    // 'Access-Control-Allow-Origin': '*',
  },
});

loginServer.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200 && res.data.code !== 201) {
    //if (res.status !== 200 && res.status !== 201) {
      responseCodePush(res.data.code);
    }
    return res;
  },
  (error) => {
    // console.log(error);
    const { message } = error;
    if (message === 'Network Error') {
      responseCodePush(502);
    } else {
      responseCodePush(500);
    }
    return Promise.reject(message);
  },
);

/**
 * axios实例
 * @type {AxiosInstance}
 */
export const server = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  // withCredentials: true,
  // crossDomain: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

/**
 * request拦截器
 */
server.interceptors.request.use(
  (config) => {
    if (config.method === 'post') {
      console.log('正在发送POST请求...');
    }
    if (config.method === 'get') {
      console.log('正在发送GET请求...');
      console.log(config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error.data.error.message);
  },
);

/**
 * response拦截器
 */
server.interceptors.response.use(
  (res) => {
    if (res.data && res.data.code && res.data.code !== 200 && res.data.code !== 201) {
    //if (res.status !== 200 && res.status !== 201) {
      responseCodePush(res.data.code); //TODO  此处跳转之后，任然返回了res
    }
    return res;
  },
  (error) => {
    console.log('Front Error:', error);
    const { response, message } = error;
    if (response) {
      const { data, status } = response;
      const code = data ? data.code : status;
      responseCodePush(code);
    } else {
      responseCodePush(500);
    }
    return Promise.reject(message);
  },
);

export const mockServer = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 15000,
  // withCredentials: true,
  // crossDomain: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
