import { server, mockServer } from '@/utils/axios';
import { LOAD_SIZE, PAGE_NUM, BUSSINESS_CODE } from '@/utils/constant';
import Moment from 'moment';

/**
 * 获取任务汇总报表接口
 * @returns {AxiosPromise<any>}
 */
export function doGetSummaryTaskList(data) {
  // return server.get('report/taskList', {
  //   pageNum: PAGE_NUM,
  //   pageSize: LOAD_SIZE,
  //   ...data,
  // });
  const reqParams = data;
  if (data.startTime) {
    reqParams.startTime = Moment(new Date(data.startTime)).format('YYYY/MM/DD');
  }
  if (data.endTime) {
    reqParams.endTime = Moment(new Date(data.endTime)).format('YYYY/MM/DD');
  }
  console.log(data);
  if (data) {
    return server.get(`report/getTaskSummary?pageNum=${PAGE_NUM}&pageSize=${LOAD_SIZE}`, { params: reqParams });
  } else {
    return server.get(`report/getTaskSummary?pageNum=${PAGE_NUM}&pageSize=${LOAD_SIZE}`);
  }
}

/**
 * 获取外呼汇总报表接口
 * @returns {AxiosPromise<any>}
 */
export function doGetSummaryCallList(data) {
  return server.post('report/outcallSummaryByDateType', {
    pageNum: PAGE_NUM,
    pageSize: LOAD_SIZE,
    ...data,
  });
}

export function doGetCuiShowBusinessData(data) {
  return server.post('report/businessByDateType', {
    businessCode: BUSSINESS_CODE.CS_STAN,
    pageNum: 0,
    pageSize: 100,
    ...data,
  });
}

export function doGetYingXiaoBusinessData(data) {
  return server.post('report/businessByDateType', {
    businessCode: BUSSINESS_CODE.YX_STAN,
    pageNum: 0,
    pageSize: 100,
    ...data,
  });
}

// TOOD 获取项目拨打汇总统计
export function doGetSummaryProjList(data) {
  const reqParams = data;
  if (data.startTime) {
    reqParams.startTime = Moment(new Date(data.startTime)).format('YYYY/MM/DD');
  }
  if (data.endTime) {
    reqParams.endTime = Moment(new Date(data.endTime)).format('YYYY/MM/DD');
  }
  return server.get('report/projectSummary', { params: Object.assign({}, reqParams, { pageNum: 1, pageSize: 1000 }) });
}

export function doGetSummaryProjDailyList(data) {
  const reqParams = data;
  if (data.startTime) {
    reqParams.startTime = Moment(new Date(data.startTime)).format('YYYY/MM/DD');
  }
  if (data.endTime) {
    reqParams.endTime = Moment(new Date(data.endTime)).format('YYYY/MM/DD');
  }
  return server.get('report/projectSummaryHistory', { params: reqParams });
}

export function doGetSummaryProjIntention(businessCode) {
  return server.get('report/getProjectIntention', { params: { businessCode } });
}

export function doGetSummaryProjIntentionList(data) {
  const reqParams = data;
  if (data.startTime) {
    reqParams.startTime = Moment(new Date(data.startTime)).format('YYYY/MM/DD');
  }
  if (data.endTime) {
    reqParams.endTime = Moment(new Date(data.endTime)).format('YYYY/MM/DD');
  }
  console.log(data);

  return server.get('report/intentSummary', { params: Object.assign({}, reqParams, { pageNum: 1, pageSize: 1000 }) });
}
