import { message } from 'antd';

import { doLogin, doUpdatePwd, doGetCaptcha } from '@/servers/userApi';

// 用户操作
export default {
  namespace: 'userActions',
  state: {
    isLogin: false,
    userInfo: null,
    showModal: false,
    captcha: undefined,
  },
  reducers: {
    userAction(state, data) {
      return {
        ...state, ...data,
      };
    },
  },
  effects: {
    // 登录
    * login({ data }, { call, put }) {
      const resp = yield call(doLogin, data);
      if (resp.data.success) {
        const {
          operId, account, operName, createTime, initialFlag,merchant={},
        } = resp.data.data;
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('operId', resp.data.data.operId);
        sessionStorage.setItem('account', resp.data.data.account);
        sessionStorage.setItem('operName', resp.data.data.operName);
        sessionStorage.setItem('initialFlag', resp.data.data.initialFlag);
        sessionStorage.setItem('createTime', resp.data.data.createTime);
        sessionStorage.setItem('rootFlag', resp.data.data.rootFlag);
        const { code, domain, merchantName} = merchant;
        sessionStorage.setItem('tenantCode', code);
        const authUrl = [];
        resp.data.data.resources.forEach((item) => {
          authUrl.push({
            item: item.url.split('M')[0],
          });
        });
        /** @namespace resp.data.data.resources */
        if (initialFlag === 1) {
          sessionStorage.setItem('authUrl', JSON.stringify([{ item: '/' }, { item: '/user' }]));
        } else {
          sessionStorage.setItem('authUrl', JSON.stringify(authUrl));
        }
        yield put({
          type: 'userAction',
          isLogin: true,
          userInfo: { operId, account, operName, createTime },
        });
        message.success(resp.data.msg);
      } else {
        const respre = yield call(doGetCaptcha);
        const imgUrl = `data:image/png;base64,${btoa(new Uint8Array(respre.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
        yield put({
          type: 'userAction',
          captcha: imgUrl,
        });

        message.error(resp.data.msg);
      }
    },
    // 登出
    logout() {
      sessionStorage.clear();
      message.success('登出成功');
    },
    // 修改密码
    * updatePwd({ data }, { call, put }) {
      const resp = yield call(doUpdatePwd, data);
      if (resp.data.success) {
        yield put({
          type: 'userAction',
          isLogin: false,
          showModal: false,
        });
        sessionStorage.clear();
        message.success(resp.data.msg);
      } else {
        message.error(resp.data.msg);
      }
    },
    // modal开关
    * changeStatus({ data }, { put }) {
      yield put({
        type: 'userAction',
        showModal: !data,
      });
    },
    // 获取验证码
    * getCaptcha(_, { call, put }) {
      const resp = yield call(doGetCaptcha);
      const imgUrl = `data:image/png;base64,${btoa(new Uint8Array(resp.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
      yield put({
        type: 'userAction',
        captcha: imgUrl,
      });
    },
  },
  subscriptions: {},
};
