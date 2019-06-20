import { server, loginServer } from '@/utils/axios';

/**
 * 获取验证码接口
 * @returns {AxiosPromise<any>}
 */
export function doGetCaptcha() {
  return loginServer.get('user/captcha', {
    responseType: 'arraybuffer',
  });
}

/**
 * 登录接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doLogin(data) {
  return loginServer.post('user/login', data);
}

/**
 * 修改密码接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doUpdatePwd(data) {
  return server.post('user/updatePwd', data);
}
