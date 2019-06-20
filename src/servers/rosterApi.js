import { mockServer, server } from '@/utils/axios';
import qs from 'qs';
import { PAGE_SIZE } from '@/utils/constant';

/**
 * 获取列表接口
 * @returns {AxiosPromise<any>}
 */
export function doGetRosterList(data) {
  const { page, startTime, endTime } = data;
  const UrlObj = Object.assign({}, { pageSize: PAGE_SIZE, pageNum: page }, data, { startTime: startTime.replace(/\-/g, '/'), endTime: endTime.replace(/\-/g, '/') });
  const qstr = qs.stringify(UrlObj, { encode: true });
  console.log('doGetRosterList params:', qstr);
  return server.get(`roll/getRosterList?${qstr}`);
}

export function doGetRosterSelect(data) {
  const { businessCode } = data;
  // const qstr = qs.stringify({ businessCode }, { encode: true });
  return server.get(`roll/getRosterList?pageSize=1000&pageNum=1&businessCode=${businessCode}`);
}

export function doGetTemplate(businessCode) {
  return server.get(`roll/getRollTemplate?businessCode=${businessCode}`);
}

export function doAddRoster(data) {
  const { query, formData } = data;
  const qstr = qs.stringify(query, { encode: true });
  return server.post(`roll/uploadRoster?${qstr}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    processData: false,
  });
}

/**
 * 导入名单数据
 * @returns {AxiosPromise<any>}
 */
export function doImportRecords(data) {
  return mockServer.post('roster/importRecords', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    processData: false,
  });
}

export function doDelRoster(rosterId) {
  return server.delete(`roll/deleteRoll/${rosterId}`);
}

export function doEditRoster({ rosterId, rosterName }) {
  return server.put(`roll/updateRoll/${rosterId}?name=${rosterName}`);
}


export function doGetRosterById(rosterId) {
  return server.get(`roll/rosterInfo?rosterId=${rosterId}`);
}

export function doGetNameList({ rosterId, pageNum }) {
  return server.get(`roll?rosterId=${rosterId}&pageSize=${PAGE_SIZE}&pageNum=${pageNum}`);
}

export function doGetTemplateColumn({ projectCode = '', taskId = '' }) {
  if (projectCode) {
    return server.get('roll/columnInfo', { params: { projectCode } });
  } else if (taskId) {
    return server.get('roll/columnInfo', { params: { taskId } });
  }
}
