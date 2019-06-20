import { message } from 'antd';
import { BASE_URL, BUSSINESS_CODE, PAGE_SIZE } from '@/utils/constant';

import {
  doGetSummaryTaskList, doGetSummaryCallList, doGetCuiShowBusinessData,
  doGetYingXiaoBusinessData, doGetSummaryProjList, doGetSummaryProjDailyList,
  doGetSummaryProjIntention, doGetSummaryProjIntentionList,
} from '@/servers/formApi';

// 用户操作
export default {
  namespace: 'formActions',
  state: {
    summaryTaskList: [],
    summaryCallList: [],
    cuiShouStatisticsData: [],
    yinXiaoStatisticsData: [],
    summaryProjList: [],
    summaryProjDailyList: {},
    projectIntention: {},
    projectIntentionList: [],
  },
  reducers: {
    showSummaryForm(state, { summaryTaskList, summaryCallList }) {
      return { ...state, summaryTaskList, summaryCallList };
    },
    showSummaryTaskForm(state, { summaryTaskList }) {
      return { ...state, summaryTaskList };
    },
    showSummaryProjForm(state, { summaryProjList }) {
      return { ...state, summaryProjList };
    },
    showSummaryProjDailyForm(state, { summaryProjDailyList }) {
      return { ...state, summaryProjDailyList };
    },
    showSummaryProjIntentionFrom(state, { projectIntention, projectIntentionList }) {
      return { ...state, projectIntention, projectIntentionList };
    },
    showSummaryCallForm(state, { summaryCallList }) {
      return { ...state, summaryCallList };
    },
    showCuiShouTab(state, { cuiShouStatisticsData }) {
      return { ...state, cuiShouStatisticsData };
    },
    showYingXiaoTab(state, { yinXiaoStatisticsData }) {
      return { ...state, yinXiaoStatisticsData };
    },
    projectIntentionData(state, { projectIntention, projectIntentionList }) {
      return { ...state, projectIntention, projectIntentionList };
    },
  },
  effects: {
    * getSummaryForm({ data }, { call, put }) {
      if (data) {
        const {
          formType, startTime, endTime, searchValue, dateType,
        } = data;
        switch (formType) {
          case 'task':
            const task_resp = yield call(doGetSummaryTaskList, { startTime, endTime, taskName: searchValue });
            if (task_resp.data.success) {
              yield put({
                type: 'showSummaryTaskForm',
                summaryTaskList: task_resp.data.data.list,
              });
            } else {
              message.error(task_resp.data.msg);
            }
            break;
          case 'project':
            const projResp = yield call(doGetSummaryProjList, { startTime, endTime, likeKeyWord: searchValue });
            if (projResp.data.success) {
              yield put({
                type: 'showSummaryProjForm',
                summaryProjList: projResp.data.data.list,
              });
            } else {
              message.error(projResp.data.msg);
            }
            break;

          case 'projectDaily':
            const projDailyRes = yield call(doGetSummaryProjDailyList, { startTime, endTime, likeKeyWord: searchValue });
            if (projDailyRes.data.success) {
              yield put({
                type: 'showSummaryProjDailyForm',
                summaryProjDailyList: projDailyRes.data.data,
              });
            } else {
              message.error(projDailyRes.data.msg);
            }
            break;
          case 'call':
            const call_resp = yield call(doGetSummaryCallList, {
              startTime,
              endTime,
              dateType,
            });
            if (call_resp.data.success) {
              yield put({
                type: 'showSummaryCallForm',
                summaryCallList: call_resp.data.data.list,
              });
            } else {
              message.error(call_resp.data.msg);
            }
            break;
          default:
            break;
        }
      } else {
        const task_resp = yield call(doGetSummaryTaskList, {});
        const call_resp = yield call(doGetSummaryCallList, {});
        if (task_resp.data.success) {
          if (call_resp.data.success) {
            yield put({
              type: 'showSummaryForm',
              summaryTaskList: task_resp.data.data.list,
              summaryCallList: call_resp.data.data.list,
            });
          } else {
            /** @namespace call_resp.data.msg */
            message.error(call_resp.data.msg);
          }
        } else {
          message.error(task_resp.data.msg);
        }
      }
    },
    * getProjectIntention({ businessCode }, { call, put, select }) {
      // const projectIntention = yield select(state => state.formActions.projectIntention);
      // const intention = Object.assign({}, projectIntention);
      // if (!intention[businessCode]) {
      //   const intensionRes = yield call(doGetSummaryProjIntention, businessCode);
      //   if (intensionRes.data.success) {
      //     intention[businessCode] = intensionRes.data.data;
      //   } else {
      //     message.error(intensionRes.data.msg);
      //   }
      // }
      yield put({
        type: 'projectIntentionData',
        projectIntention: {},
        projectIntentionList: [],
      });
    },
    * getProjectIntentionData({ data }, { call, put }) {
      const res = yield call(doGetSummaryProjIntentionList, data);
      if (res.data.success) {
        console.log('project intention data:', data);
        yield put({
          type: 'showSummaryProjIntentionFrom',
          projectIntention: res.data.data.header,
          projectIntentionList: res.data.data.list,
        });
      } else {
        message.error(res.data.msg);
      }
    },
    * getProjectDaily({ data }, { call, put, select }) {
      const dailyList = yield select(state => state.formActions.summaryProjDailyList);
      const { projectCode, startTime, endTime } = data;

      const projDailyRes = yield call(doGetSummaryProjDailyList, { startTime, endTime, projectCode });
      if (projDailyRes.data.success) {
        const newDailyList = Object.assign({}, dailyList);
        newDailyList[projectCode] = projDailyRes.data.data.list;
        yield put({
          type: 'showSummaryProjDailyForm',
          summaryProjDailyList: newDailyList,
        });
      } else {
        message.error(projDailyRes.data.msg);
      }
    },
    * getBusinessStatisticsData({ data }, { call, put }) {
      const { businessCode, startTime, endTime, dateType } = data;
      switch (businessCode) {
        case BUSSINESS_CODE.CS_STAN:
        {
          const csRes = yield call(doGetCuiShowBusinessData, { startTime, endTime, dateType });
          if (csRes.data.success) {
            yield put({
              type: 'showCuiShouTab',
              cuiShouStatisticsData: csRes.data.data.list,
            });
          } else {
            message.error(csRes.data.msg);
          }
          break;
        }
        case BUSSINESS_CODE.YX_STAN:
        {
          const csRes = yield call(doGetYingXiaoBusinessData, { startTime, endTime, dateType });
          if (csRes.data.success) {
            yield put({
              type: 'showYingXiaoTab',
              yinXiaoStatisticsData: csRes.data.data.list,
            });
          } else {
            message.error(csRes.data.msg);
          }
          break;
        }
        default:
          break;
      }
    },
  },
  subscriptions: {},
};
