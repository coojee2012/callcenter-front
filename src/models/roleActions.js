import { message } from 'antd';

import {
  doGetRoleList, doGetRoleInfo, doGetResourceList, doUpdateRole,
  doDelRole, doAddRole,
} from '@/servers/roleApi';

// 成员（操作员）页面操作
export default {
  namespace: 'roleActions',
  state: {
    roleList: [],
    roleInfo: '',
    resourceList: [],
    oriSelectedKeys: [],
    showModal: false,
  },
  reducers: {
    showRoleList(state, { roleList }) {
      return { ...state, roleList };
    },
    showRoleInfo(state, {
      roleInfo, showModal, resourceList, oriSelectedKeys,
    }) {
      return {
        ...state, roleInfo, showModal, resourceList, oriSelectedKeys,
      };
    },
    changeSelectedKey(state, { oriSelectedKeys }) {
      return { ...state, oriSelectedKeys };
    },
  },
  effects: {
    // 获取角色列表
    * getRoleList({ data }, { call, put }) {
      const resp = yield call(doGetRoleList, data);
      if (resp.data.success) {
        yield put({
          type: 'showRoleList',
          roleList: resp.data.data.list,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 获取角色详情
    * getRoleInfo({ data }, { call, put }) {
      const resp = yield call(doGetRoleInfo, data);
      const res = yield call(doGetResourceList);
      if (resp.data.success) {
        const oriSelectedKeys = [];
        resp.data.data.resourceList.map(item => (
          oriSelectedKeys.push(item.resourceId)
        ));
        if (res.data.success) {
          yield put({
            type: 'showRoleInfo',
            roleInfo: resp.data.data,
            resourceList: res.data.data,
            oriSelectedKeys,
          });
        } else {
          message.error(res.data.msg);
        }
      } else {
        message.error(resp.data.msg);
      }
    },
    // 获取资源列表
    * getResourceList(_, { call, put }) {
      const resp = yield call(doGetResourceList);
      if (resp.data.success) {
        yield put({
          type: 'showRoleInfo',
          resourceList: resp.data.data,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 更新角色详情
    * updateRoleInfo({ data }, { call, put }) {
      const { resourceList } = data;
      const newList = [];
      resourceList.forEach((item) => {
        newList.push({
          resourceId: item,
        });
      });
      const resp = yield call(doUpdateRole, {
        ...data,
        resourceList: newList,
      });
      if (resp.data.success) {
        yield put({
          type: 'showRoleInfo',
          showModal: true,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 删除角色
    // TODO 删除数据后完全可以不用重新从服务器拉取信息，有必要吗？
    * delRole({ data }, { call, put }) {
      yield put({
        type: 'showRoleList',
        roleList: [],
      });
      const resp = yield call(doDelRole, data);
      if (resp.data.success) {
        const res = yield call(doGetRoleList);
        if (res.data.success) {
          yield put({
            type: 'showRoleList',
            roleList: res.data.data.list,
          });
        } else {
          message.error(res.data.msg);
        }
        message.success(res.data.msg);
      } else {
        message.error(resp.data.msg);
      }
    },
    // 新增角色
    * addRole({ data }, { call, put }) {
      const { roleName, value, remark } = data;
      const resourceList = [];
      value.forEach((item) => {
        resourceList.push({
          resourceId: item,
        });
      });
      const resp = yield call(doAddRole, {
        roleName,
        resourceList,
        remark,
      });
      if (resp.data.success) {
        yield put({
          type: 'showRoleInfo',
          showModal: true,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 关闭提示框
    * closeModel(_, { put }) {
      yield put({
        type: 'showRoleInfo',
        showModal: false,
      });
    },
  },
  subscriptions: {
    // 监听路由
    // info({ history, dispatch }) {
    //   history.listen((location) => {
    // const match = pathToRegexp('/role/:id').exec(location.pathname);
    // console.log(location)
    // if (match) {
    //   dispatch({
    //     type: 'getRoleInfo',
    //     data: {
    //       roleId: match[1],
    //     },
    //   });
    // }
    // });
    // },
  },
};
