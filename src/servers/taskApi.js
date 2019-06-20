import { server } from '@/utils/axios';
import { PAGE_SIZE, PAGE_NUM, LOAD_SIZE } from '@/utils/constant';

/**
 * 获取任务列表接口
 * @returns {AxiosPromise<any>}
 */
export function doGetTaskList(data) {
  const { page, auditStatus, taskNameLike } = data;
  let searchPramas = `pageNum=${page}`;
  if (auditStatus > -1) {
    searchPramas += `&auditStatus=${auditStatus}`;
  }
  if (taskNameLike) {
    searchPramas += `&taskNameLike=${taskNameLike}`;
  }
  return server.get(`task/taskList?pageSize=${PAGE_SIZE}&${searchPramas}`);
}

/**
 * 新增任务接口
 * @returns {AxiosPromise<any>}
 */
export function doAddTask(data) {
  return server.post('task/addTask', data);
}

/**
 * 获取业务类型接口
 * @returns {AxiosPromise<any>}
 */
export function doGetTaskTypeList() {
  return server.get('bizType/list');
}

/**
 * 获取业务参数接口
 * @returns {AxiosPromise<any>}
 */
export function doGetTaskPramas(typeId) {
  return server.get(`bizType/businessParamList?businessTypeId=${typeId}`);
}
/**
 * 获取任务数据
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doGetTaskUserList(data) {
  const { taskId, pageNum = 1 } = data;
  return server.get(`task/getUserValueList?taskId=${taskId}&pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);
}

/**
 * 获取任务详细
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doGetTaskDetail(data) {
  return server.get(`task/taskDetail?taskId=${data}`);
}
/**
 * 获取任务审核流程
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doGetTaskProcessList(data) {
  return server.get(`task/taskProcessList?taskId=${data}`);
}

/**
 * 审核任务接口(演示)
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doAuditTask(data) {
  return server.put('task/auditTaskProcess', data);
}

export function doGetCountStatis() {
  return server.get('task/taskCountStatistic');
}

export function doGetDials(data) {
  const { taskId, pageNum = 1 } = data;
  return server.get(`report/recordList?taskId=${taskId}&pageNum=${pageNum}&pageSize=${PAGE_SIZE}`);
  // return server.get('report/recordList', {
  //   pageNum: PAGE_NUM,
  //   pageSize: LOAD_SIZE,
  //   taskId: data,
  // });
}
