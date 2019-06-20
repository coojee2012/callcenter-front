import { message } from 'antd';

import {
  doGetTaskTypeList,
} from '@/servers/taskApi';
import {
  doGetRosterList, doAddRoster, doImportRecords,
  doDelRoster, doGetRosterById, doGetNameList, doEditRoster,
  doGetTemplate,
} from '@/servers/rosterApi';

export default {
  namespace: 'rosterActions',
  state: {
    taskTypeList: [],
    totalCount: 0,
    rosterList: [],
    rosterInfo: null,
    nameList: [],
    isEdited: false,
    showAddModal: false,
    showEditModal: false,
    openImportNameModal: false,
    rollTemplate: [],
    importNameCode: null,
  },
  reducers: {
    showRostersList(state, { data }) {
      return { ...state, ...data };
    },
    showAddNewRoster(state, { data }) {
      return { ...state, ...data };
    },
    showRosterInfo(state, { data }) {
      return { ...state, ...data };
    },
    showImportNameModal(state, { openImportNameModal, importNameCode }) {
      return { ...state, openImportNameModal, importNameCode };
    },
  },
  effects: {
    * loadListPage(_, { call, put }) {
      const resp = yield call(doGetTaskTypeList);
      if (resp.data.success) {
        yield put({
          type: 'showRostersList',
          data: {
            taskTypeList: resp.data.data,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * loadRosterInfo({ rosterId }, { call, put, select }) {
      const rosterList = yield select(state => state.rosterActions.rosterList); //这里就获取到了当前state中的数据num
      const typeList = yield select(state => state.rosterActions.taskTypeList);
      let roster = null;
      if (rosterList && rosterList.length > 0) {
        rosterList.forEach((item) => {
          if (item.rosterId === Number(rosterId)) {
            roster = Object.assign({}, item);
          }
        });
      }
      if (!roster || typeList.length < 1) {
        const resTypeList = yield call(doGetTaskTypeList);
        if (resTypeList.data.success) {
          yield put({
            type: 'showRosterInfo',
            data: { taskTypeList: resTypeList.data.data },
          });
        } else {
          message.error(resTypeList.data.msg);
        }
        // TODO 从服务器获取信息
        const resp = yield call(doGetRosterById, rosterId);
        if (resp.data.success) {
          roster = resp.data.data;
        } else {
          message.error(resp.data.msg);
        }
      }
      if (!roster) {
        message.error('系统找不到该名单，请重试！');
        return;
      }
      let nameList = null;
      const nameListRes = yield call(doGetNameList, { pageNum: 1, rosterId: roster.rosterId });

      if (nameListRes.data.success) {
        nameList = nameListRes.data.data;
      } else {
        message.error(nameListRes.data.msg);
      }
      yield put({
        type: 'showRosterInfo',
        data: {
          rosterInfo: roster,
          nameList,
          isEdited: false,
        },
      });
    },

    * getRosterNames({ data }, { call, put }) {
      const { pageNum, rosterId } = data;
      let nameList = null;
      const nameListRes = yield call(doGetNameList, { pageNum, rosterId });
      if (nameListRes.data.success) {
        nameList = nameListRes.data.data;
        yield put({
          type: 'showRosterInfo',
          data: {
            nameList,
          },
        });
      } else {
        message.error(nameListRes.data.msg);
      }
    },
    * loadAddPage(_, { call, put }) {
      const resp = yield call(doGetTaskTypeList);
      if (resp.data.success) {
        yield put({
          type: 'showAddNewRoster',
          data: {
            taskTypeList: resp.data.data,
            rollTemplate: [],
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * getRosterList({ data }, { call, put, select }) {
      const resp = yield call(doGetRosterList, data);
      if (resp.data.success) {
        const { totalCount, list } = resp.data.data;
        yield put({
          type: 'showRostersList',
          data: {
            rosterList: list,
            totalCount,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * getTemplate({ businessCode }, { call, put, select }) {
      const resp = yield call(doGetTemplate, businessCode);
      if (resp.data.success) {
        yield put({
          type: 'showAddNewRoster',
          data: {
            rollTemplate: resp.data.data,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * addRoster({ data }, { call, put }) {
      const formData = new FormData();

      const { businessCode, rosterName, rollTemplateId, roll } = data;
      formData.append('roster', roll);
      // formData.append('remark', data.remark);
      const resp = yield call(doAddRoster, Object.assign({}, { formData, query: { businessCode, rosterName, rollTemplateId } }));
      if (resp.data.success) {
        yield put({
          type: 'showAddNewRoster',
          data: {
            showAddModal: true,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * editRoster({ data }, { call, put, select }) {
      const { rosterId, rosterName } = data;
      const oldInfo = yield select(state => state.rosterActions.rosterInfo);
      const resp = yield call(doEditRoster, Object.assign({}, { rosterId, rosterName }));
      if (resp.data.success) {
        yield put({
          type: 'showRosterInfo',
          data: {
            rosterInfo: Object.assign({}, oldInfo, { rosterName }),
            showEditModal: false,
          },
        });
        message.info('修改成功');
      } else {
        message.error(resp.data.msg);
      }
    },
    * toggerEditModal(_, { put, select }) {
      const old = yield select(state => state.rosterActions.showEditModal);
      yield put({
        type: 'showRosterInfo',
        data: {
          showEditModal: !old,
        },
      });
    },
    * importNameRecords({ data }, { call, put }) {
      const formData = new FormData();
      formData.append('roll', data.roll);
      formData.append('rosterCode', data.rosterCode);
      const resp = yield call(doImportRecords, formData);
      if (resp.data.success) {
        yield put({
          type: 'showImportNameModal',
          openImportNameModal: false,
          importNameCode: null,
        });
      } else {
        message.error(resp.data.msg);
      }
    },

    * delRoster({ rosterId }, { call, put, select }) {
      const resp = yield call(doDelRoster, rosterId);
      if (resp.data.success) {
        const rosterList = yield select(state => state.rosterActions.rosterList); //这里就获取到了当前state中的数据num
        const totalCount = yield select(state => state.rosterActions.totalCount);
        const newList = [...rosterList];
        for (let i = 0; i < newList.length; i++) {
          if (newList[i].rosterId === rosterId) {
            newList.splice(i, 1);
            break;
          }
        }
        yield put({
          type: 'showRostersList',
          data: {
            rosterList: newList,
            totalCount: totalCount - 1,
          },
        });
        message.info('删除成功！');
      } else {
        message.error(resp.data.msg);
      }
    },
    // 关闭提示框
    * closeModel(_, { put }) {
      yield put({
        type: 'showAddNewRoster',
        data: {
          showAddModal: false,
          loading: false,
        },
      });
    },

    // 关闭提示框
    * closeImportModel(_, { put }) {
      yield put({
        type: 'showImportNameModal',
        openImportNameModal: false,
        importNameCode: null,
      });
    },

    // 关闭提示框
    * openImportModel({ importNameCode }, { put }) {
      yield put({
        type: 'showImportNameModal',
        openImportNameModal: true,
        importNameCode,
      });
    },
  },
  subscriptions: {
  },
};
