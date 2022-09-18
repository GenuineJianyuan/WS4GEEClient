/**
 * Created by yqr on 2018/4/13.
 */
import Env from './env';
import axios from 'axios'
import {road} from '../road.js'
import router from '../router'

axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头

//添加一个请求拦截器
// axios.interceptors.request.use(function (config) {
//   console.dir(config);
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data && response.data.errcode) {
    if (parseInt(response.data.errcode) === 40001) {
      //未登录
      road.$emit('goto', '/login')
    }
  }
  return response;
}, function (error) {
  // Do something with response error
  if (error.response) {
    switch (error.response.status) {
      case 401:
        alert("没有授权或授权已过期，请重新登录")
        router.replace({
          path: 'login',
          query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
    }
  }
  return Promise.reject(error);
});

//基地址
let base = Env.baseURL;

//测试使用
export const ISDEV = Env.isDev;

//通用方法
export const POST = (url, params) => {
  return axios.post(`${base}${url}`, params).then(res => res.data)
}

export const GET = (url, params) => {
  return axios.get(`${base}${url}`, {params: params}).then(res => res.data)
}

export const PUT = (url, params) => {
  return axios.put(`${base}${url}`, params).then(res => res.data)
}

export const DELETE = (url, params) => {
  return axios.delete(`${base}${url}`, {params: params}).then(res => res.data)
}

export const PATCH = (url, params) => {
  return axios.patch(`${base}${url}`, params).then(res => res.data)
}
export  default axios
