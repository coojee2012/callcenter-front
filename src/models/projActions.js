import { message } from 'antd';

import {
  doGetTaskTypeList,
} from '@/servers/taskApi';

import {
  doGetProjList, doAddProj, doGetProjByCode, doEditProj, doGetBusinessPramas,
  doEndProj, doGetNameList, doGetTaskByCode, doGetProjectCalls, doGetProjectUserStatic,
} from '@/servers/projApi';

import {
  doGetTemplateColumn,
} from '@/servers/rosterApi';

export default {
  namespace: 'projActions',
  state: {
    taskTypeList: [],
    totalCount: 0,
    businessPramas: [],
    showBussinessParam: false,
    projList: [],
    projectInfo: null,
    nameList: [],
    taskList: [],
    nameDails: [],
    showAddModal: false,
    isEdited: false,
    projectCalls: null,
    businessSummary: null,
    templateColums: [],
  },
  reducers: {
    showProjList(state, { data }) {
      return { ...state, ...data };
    },
    addPage(state, { data }) {
      return { ...state, ...data };
    },
    detailPage(state, { data }) {
      return { ...state, ...data };
    },
    endAProj(state, { projList, projectInfo }) {
      return { ...state, projList, projectInfo };
    },
  },
  effects: {
    * loadListPage(_, { call, put }) {
      const resp = yield call(doGetTaskTypeList);
      if (resp.data.success) {
        yield put({
          type: 'showProjList',
          data: { taskTypeList: resp.data.data },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * loadAddPage(_, { call, put }) {
      const resp = yield call(doGetTaskTypeList);
      if (resp.data.success) {
        yield put({
          type: 'addPage',
          data: {
            taskTypeList: resp.data.data,
            showBussinessParam: false,
            businessPramas: [],
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * getProjList({ data }, { call, put, select }) {
      const resp = yield call(doGetProjList, data);
      if (resp.data.success) {
        const { totalCount, list } = resp.data.data;
        yield put({
          type: 'showProjList',
          data: {
            projList: list,
            totalCount,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * addProj({ data }, { call, put }) {
      const { businessPramaValues } = data;
      const pramaLabels = [];
      const pramaVlaues = [];
      const pramaIds = [];
      businessPramaValues.forEach((element) => {
        pramaLabels.push(element.label);
        pramaVlaues.push(element.value);
        pramaIds.push(element.paramId);
      });
      delete data.businessPramaValues;
      const resp = yield call(doAddProj, Object.assign({}, data,
        { label: pramaLabels, paramId: pramaIds, value: pramaVlaues }));
      if (resp.data.success) {
        yield put({
          type: 'addPage',
          data: {
            showAddModal: true,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * editProj({ data }, { call, put }) {
      const { businessPramaValues } = data;
      const label = [];
      const value = [];
      const paramId = [];
      businessPramaValues.forEach((element) => {
        label.push(element.label);
        value.push(element.value);
        paramId.push(element.paramId);
      });
      delete data.businessPramaValues;
      const resp = yield call(doEditProj, Object.assign({}, data, { value, label, paramId }));
      if (resp.data.success) {
        yield put({
          type: 'detailPage',
          data: {
            isEdited: true,
          },
        });
        message.info('修改成功！');
      } else {
        message.error(resp.data.msg);
      }
    },
    * endProj({ projectCode }, { call, put, select }) {
      const resp = yield call(doEndProj, { projectCode });
      const projList = yield select(state => state.projActions.projList); //这里就获取到了当前state中的数据num
      const projectInfo = yield select(state => state.projActions.projectInfo);
      if (resp.data.success) {
        const newList = [...projList];
        const newInfo = Object.assign({}, projectInfo);
        for (let i = 0; i < newList.length; i++) {
          if (newList[i].projectCode === projectCode) {
            newList[i].status = 2;
            break;
          }
        }
        if (newInfo && newInfo.projectCode === projectCode) {
          newInfo.status = 2;
        }
        yield put({
          type: 'endAProj',
          projList: newList,
          projectInfo: newInfo,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * getBusinessPramas({ businessTypeId }, { call, put }) {
      const resp = yield call(doGetBusinessPramas, businessTypeId);
      if (resp.data.success) {
        yield put({
          type: 'addPage',
          data: {
            businessPramas: resp.data.data,
            showBussinessParam: true,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    // 关闭提示框
    * closeModel(_, { put }) {
      yield put({
        type: 'addPage',
        data: {
          showAddModal: false,
          loading: false,
        },
      });
    },
    // 获取项目基本信息
    * loadProjectInfo({ projectCode }, { call, put, select }) {
      const projList = yield select(state => state.projActions.projList); //这里就获取到了当前state中的数据num
      const typeList = yield select(state => state.projActions.taskTypeList);
      let project = null;
      if (projList && projList.length > 0) {
        projList.forEach((item) => {
          if (item.projectCode === projectCode) {
            project = Object.assign({}, item);
          }
        });
      }
      if (!project || typeList.length < 1) {
        const resTypeList = yield call(doGetTaskTypeList);
        if (resTypeList.data.success) {
          yield put({
            type: 'detailPage',
            data: { taskTypeList: resTypeList.data.data },
          });
        } else {
          message.error(resTypeList.data.msg);
        }
        // TODO 从服务器获取信息
        const resp = yield call(doGetProjByCode, projectCode);
        if (resp.data.success) {
          project = resp.data.data;
        } else {
          message.error(resp.data.msg);
        }
      }
      let businessSummary = null;
      const summaryRes = yield call(doGetProjectUserStatic, { projectCode: project.projectCode });

      if (summaryRes.data.success) {
        businessSummary = summaryRes.data.data;
      } else {
        message.error(summaryRes.data.msg);
      }

      let taskList = [];
      const taskListRes = yield call(doGetTaskByCode, project.projectCode);

      if (taskListRes.data.success) {
        taskList = taskListRes.data.data;
      } else {
        message.error(taskListRes.data.msg);
      }

      let templateColums = [];
      const templateRes = yield call(doGetTemplateColumn, { projectCode: project.projectCode });
      if (templateRes.data.success) {
        templateColums = templateRes.data.data;
      } else {
        message.error(templateRes.data.msg);
      }

      console.log('actions projectInfo', project);
      yield put({
        type: 'detailPage',
        data: {
          projectInfo: project,
          nameList: [],
          isEdited: false,
          taskList,
          projectCalls: null,
          businessSummary,
          templateColums,
        },
      });
    },

    * getUserStatics({ projectCode, pageNum }, { call, put }) {
      let businessSummary = null;
      const summaryRes = yield call(doGetProjectUserStatic, { projectCode, pageNum });

      if (summaryRes.data.success) {
        businessSummary = summaryRes.data.data;
      } else {
        message.error(summaryRes.data.msg);
      }
      yield put({
        type: 'detailPage',
        data: {
          businessSummary,
        },
      });
    },
    * getDialList({ projectCode, pageNum }, { call, put, select }) {
      const resp = yield call(doGetProjectCalls, { projectCode, pageNum });
      if (resp.data.success) {
        yield put({
          type: 'detailPage',
          data: {
            projectCalls: resp.data.data,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) { // 这里的方法名可以随便命名，当监听有变化的时候就会依次执行这的变化,这里的dispatch和history和之前说的是一样的
      window.onresize = () => { //这里表示的当浏览器的页面的大小变化时就会触发里面的dispatch方法，这里的save就是reducers中的方法名
        console.log('proj onresize 2!!!');
      };
    },
  },
};
