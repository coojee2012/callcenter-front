import { message } from 'antd';
import { findItemByKey } from '@/utils/common';
import {
  doAddTask, doGetTaskTypeList, doGetTaskList, doAuditTask, doGetTaskUserList,
  doGetTaskProcessList, doGetTaskPramas, doGetTaskDetail, doGetDials,
  doGetCountStatis,
} from '@/servers/taskApi';

import {
  doGetUseableProjects,
} from '@/servers/projApi';

import {
  doGetRosterSelect, doGetTemplateColumn,
} from '@/servers/rosterApi';


// 任务操作
export default {
  namespace: 'taskActions',
  state: {
    showModal: false,
    showTypeParam: false,
    taskTypeList: [],
    useableProjs: [],
    taskList: [],
    nameList: [],
    totalCount: 0,
    auditStatus: '',
    taskTypePramas: [],
    templateColums: [],
    taskDetail: null,
    taskDials: null,
  },
  reducers: {
    // 添加任务页面
    addPage(state, newState) {
      return { ...state, ...newState };
    },
    // 任务列表页面
    showTaskList(state, { taskList, totalCount, totalCompleted, auditStatus }) {
      return {
        ...state, taskList, totalCount, totalCompleted, auditStatus,
      };
    },
    // 任务详情页面
    showTaskInfo(state, { data }) {
      // const { taskInfo, processInfo, taskDetail, taskDials } = data;
      return {
        ...state,
        ...data,
      };
    },
  },
  effects: {
    // 获取任务列表
    * getTaskList({ data }, { call, put, select }) {
      const resCout = yield call(doGetCountStatis);
      const resp = yield call(doGetTaskList, data);
      if (resCout.data.success && resp.data.success) {
        /** @namespace state.taskActions */
        // if (data) {
        //  totalCount = yield select(state => state.taskActions.totalCount);
        //   totalCompleted = yield select(state => state.taskActions.totalCompleted);
        // } else {
        const { totalCount, passCount } = resCout.data.data;
        // const totalCompleted = resp.data.data.list.filter(item => item.auditStatus === 3).length;
        // }
        yield put({
          type: 'showTaskList',
          taskList: resp.data.data.list,
          totalCount,
          totalCompleted: passCount,
          auditStatus: data,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 增加任务
    * addTask({ data }, { call, put }) {
      const formData = new FormData();
      formData.append('rosterId', data.rosterId);
      formData.append('businessCode', data.businessCode);
      formData.append('taskName', data.taskName);
      formData.append('startTime', data.startTime);
      formData.append('endTime', data.endTime);
      formData.append('remark', data.remark);
      const pramaLabels = [];
      const pramaVlaues = [];
      const pramaIds = [];
      data.typePramaValues.forEach((element) => {
        pramaLabels.push(element.label);
        pramaVlaues.push(element.value);
        pramaIds.push(element.paramId);
      });
      formData.append('label', pramaLabels);
      formData.append('paramId', pramaIds);
      formData.append('value', pramaVlaues);
      delete data.typePramaValues;
      const resp = yield call(doAddTask, Object.assign({}, data, { label: pramaLabels, paramId: pramaIds, value: pramaVlaues }));
      if (resp.data.success) {
        yield put({
          type: 'addPage',
          showModal: true,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 获取指定任务类型的参数
    * getTaskPramas({ data }, { call, put }) {
      const resp = yield call(doGetTaskPramas, data);
      if (resp.data.success) {
        yield put({
          type: 'addPage',
          taskTypePramas: resp.data.data,
          showTypeParam: true,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // add页面加载
    * loadAddPage({ projectCode }, { call, put }) {
      const resp = yield call(doGetTaskTypeList);
      const resProjs = yield call(doGetUseableProjects);
      let nameList = [];
      if (resp.data.success && resProjs.data.success) {
        if (projectCode && resProjs.data.data.length > 0) {
          console.log('useable projet is get over....when did update');
          const o = findItemByKey(resProjs.data.data, 'projectCode', projectCode);
          if (o) {
            const { businessCode } = o;
            const resRoster = yield call(doGetRosterSelect, { businessCode });
            if (resRoster.data.success) {
              nameList = resRoster.data.data;
            }
          }
        }
      } else {
        message.error(resp.data.msg || resProjs.data.msg);
        return;
      }
      yield put({
        type: 'addPage',
        taskTypeList: resp.data.data,
        useableProjs: resProjs.data.data,
        nameList,
      });
    },
    * getNameLists({ businessCode }, { call, put }) {
      const resRoster = yield call(doGetRosterSelect, { businessCode });
      if (resRoster.data.success) {
        yield put({
          type: 'addPage',
          nameList: resRoster.data.data,
        });
      } else {
        message.error(resRoster.data.msg);
      }
    },
    // 关闭提示框
    * closeModel(_, { put }) {
      yield put({
        type: 'addPage',
        showModal: false,
        loading: false,
      });
    },
    // 获取任务详情
    * getTaskInfo({ data }, { call, put }) {
      const resp = yield call(doGetTaskUserList, { taskId: data, pageNum: 1 });
      const res = yield call(doGetTaskProcessList, data);
      const resDetail = yield call(doGetTaskDetail, data);
      const resDials = yield call(doGetDials, { taskId: data, pageNum: 1 });
      const templateRes = yield call(doGetTemplateColumn, { taskId: data });
      if (resp.data.success) {
        if (res.data.success) {
          yield put({
            type: 'showTaskInfo',
            data: {
              taskInfo: resp.data.data,
              processInfo: res.data.data,
              taskDetail: resDetail.data.data,
              taskDials: resDials.data.data,
              templateColums: templateRes.data.data,
            },
          });
        }
      } else {
        message.error(resp.data.msg);
      }
    },
    * getTaskDials({ data }, { call, put }) {
      const { taskId, pageNum } = data;
      const resDials = yield call(doGetDials, { taskId, pageNum });
      if (resDials.data.success) {
        yield put({
          type: 'showTaskInfo',
          data: {
            taskDials: resDials.data.data,
          },
        });
      } else {
        message.error(resDials.data.msg);
      }
    },
    // 获取任务详情
    * getTaskNames({ data }, { call, put }) {
      const { taskId, pageNum } = data;
      const resp = yield call(doGetTaskUserList, { taskId, pageNum });
      if (resp.data.success) {
        yield put({
          type: 'showTaskInfo',
          data: {
            taskInfo: resp.data.data,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 模拟审核任务
    * auditTask({ data }, { call, put, select }) {
      const auditStatus = yield select(state => state.taskActions.auditStatus);
      const resp = yield call(doAuditTask, data);
      if (resp.data.success) {
        yield put({
          type: 'addPage',
          showModal: true,
        });
        // const res = yield call(doGetTaskList, auditStatus);
        // if (res.data.success) {
        //   const totalCompleted = res.data.data.list.filter(item => item.auditStatus === 3).length;
        //   yield put({
        //     type: 'showTaskList',
        //     taskList: res.data.data.list,
        //     totalCount: res.data.data.totalCount,
        //     totalCompleted,
        //     auditStatus,
        //   });
        // } else {
        //   message.error(res.data.msg);
        // }
        // message.error(res.data.msg);
      } else {
        message.error(resp.data.msg);
      }
    },
  },
  subscriptions: {},
};
