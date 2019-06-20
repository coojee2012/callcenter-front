import { message } from 'antd';
import {
  doGetMemberList, doRegisterMember, doGetMemberInfo, doUpdateMember,
  doDeleteMember, doResetMemberPwd,
} from '@/servers/memberApi';

// 成员（操作员）页面操作
export default {
  namespace: 'memberActions',
  state: {
    memberList: [],
    showModal: false,
    pass: '',
    oriSelectedKeys: [],
  },
  reducers: {
    showMemberList(state, { memberList }) {
      return { ...state, memberList };
    },
    showPassModal(state, { showModal, pass }) {
      return { ...state, showModal, pass };
    },
    showMemberInfo(state, { memberInfo, roleList, oriSelectedKeys }) {
      return {
        ...state, memberInfo, roleList, oriSelectedKeys,
      };
    },
    changeSelectedKey(state, { oriSelectedKeys }) {
      return { ...state, oriSelectedKeys };
    },
  },
  effects: {
    // 获取操作员列表
    * getMemberList({ data }, { call, put }) {
      const resp = yield call(doGetMemberList, data);
      if (resp.data.success) {
        yield put({
          type: 'showMemberList',
          memberList: resp.data.data.list,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 注册操作员
    * registerMember({ data }, { call, put }) {
      const roleList = [];
      const enable = data.enable ? 1 : 0;
      data.roles.forEach((item) => {
        roleList.push({
          roleId: item,
        });
      });
      const resp = yield call(doRegisterMember, {
        ...data,
        roleList,
        enable,
      });
      if (resp.data.success) {
        /** @namespace resp.data.data.randomPwd */
        yield put({
          type: 'showPassModal',
          showModal: true,
          pass: resp.data.data.randomPwd,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 获取操作员详情
    * getMemberInfo({ data }, { call, put }) {
      const resp = yield call(doGetMemberInfo, data.operId);
      if (resp.data.success) {
        const oriSelectedKeys = [];
        resp.data.data.roles.map(item => oriSelectedKeys.push(item.roleId));
        yield put({
          type: 'showMemberInfo',
          memberInfo: resp.data.data,
          oriSelectedKeys,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 更新操作员
    * updateMember({ data }, { call, put }) {
      const roleList = [];
      const enable = data.enable ? 1 : 0;
      const { account, operName, operId } = data;
      data.roles.forEach((item) => {
        roleList.push({
          roleId: item,
        });
      });
      const resp = yield call(doUpdateMember, {
        account,
        operId,
        operName,
        roleList,
        enable,
      });
      if (resp.data.success) {
        yield put({
          type: 'showPassModal',
          showModal: true,
        });
        message.info('保存成功');
      } else {
        message.error(resp.data.msg);
      }
    },
    // 删除操作员
    * deleteMember({ data }, { call, put }) {
      const resp = yield call(doDeleteMember, data.operId);
      if (resp.data.success) {
        message.success(resp.data.msg);
        const res = yield call(doGetMemberList);
        if (res.data.success) {
          const memberList = [];
          res.data.data.list.forEach((item) => {
            if (item.validFlag !== 0) {
              memberList.push(item);
            }
          });
          yield put({
            type: 'showMemberList',
            memberList,
          });
        } else {
          message.error(resp.data.msg);
        }
      } else {
        message.error(resp.data.msg);
      }
    },
    // 重置操作员密码
    * resetMemberPwd({ data }, { call, put }) {
      const resp = yield call(doResetMemberPwd, data);
      if (resp.data.success) {
        yield put({
          type: 'showPassModal',
          showModal: true,
          pass: resp.data.data.randomPwd,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 关闭提示框
    * closeModel(_, { put }) {
      yield put({
        type: 'showPassModal',
        showModal: false,
        pass: '',
      });
    },
  },
};
