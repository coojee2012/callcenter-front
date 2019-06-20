import { server, mockServer } from '@/utils/axios';
import qs from 'qs';
import { PAGE_SIZE } from '@/utils/constant';
/**
 * 获取列表接口
 * @returns {AxiosPromise<any>}
 */
export function doGetProjList(data) {
  const { page, startTime, endTime } = data;
  const UrlObj = Object.assign({}, { pageSize: PAGE_SIZE, pageNum: page }, data, { startTime: startTime.replace(/\-/g, '/'), endTime: endTime.replace(/\-/g, '/') });
  const qstr = qs.stringify(UrlObj, { encode: true });
  console.log('getProjList params:', qstr);
  return server.get(`project/projectList?${qstr}`);
}

export function doAddProj(data) {
  return server.post('project/addProject', data);
}

export function doGetProjByCode(projectCode) {
  return server.get(`project/detailProject/${projectCode}`);
}

export function doGetTaskByCode(projectCode) {
  return server.get(`project/frontTasks/${projectCode}`);
}
export function doEditProj(data) {
  return server.put('project/editProject', data);
}

export function doEndProj(data) {
  return server.put('project/endProject', data);
}


export function doGetBusinessPramas(businessTypeId) {
  return server.get(`/bizType/businessParamListProject?businessTypeId=${businessTypeId}`);
}

export function doGetNameList({ pageNum, projectCode }) {
  return server.get(`roll?rosterId=2&pageSize=${PAGE_SIZE}&pageNum=${pageNum}`);
}

export function doGetUseableProjects() {
  return server.get('project/projectListNoEnd');
}

export function doGetProjectCalls(data) {
  const { projectCode, pageNum = 1 } = data;
  return server.get(`report/recordList?projectCode=${projectCode}&pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);
  // return server.get('report/recordList', {
  //   pageNum: PAGE_NUM,
  //   pageSize: LOAD_SIZE,
  //   taskId: data,
  // });
}

export function doGetProjectUserStatic({ projectCode, pageNum = 1 }) {
  return server.get(`project/userStatistic?projectCode=${projectCode}&pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);
}
