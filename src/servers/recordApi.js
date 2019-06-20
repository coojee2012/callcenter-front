import qs from 'qs';
import { server } from '@/utils/axios';
import { PAGE_SIZE, OUTBOUND_URL } from '@/utils/constant';

/**
 * 获取录音文件接口
 * @returns {AxiosPromise<any>}
 */
export function doGetRecordList(data) {
  const { startTime, endTime } = data;
  const UrlObj = Object.assign({}, { pageSize: PAGE_SIZE }, data, { startTime: startTime.replace(/-/g, '/'), endTime: endTime.replace(/-/g, '/') });
  const qstr = qs.stringify(UrlObj, { encode: true });
  return server.get(`report/recordList?${qstr}`);
}

/**
 * 获取录音文件下载标识符,再get orm/record/exportVoice/{voiceTag} 链接下载
 * @returns {AxiosPromise<any>}
 */
export function doGetExportVoiceTag(data) {
  return server.post(`${OUTBOUND_URL}orm/record/getExportVoiceTag`, {
    ...data,
  });
}

/**
 * 获取excel文件下载标识符
 * @returns {AxiosPromise<any>}
 */
export function doGetExportExcelTag(data) {
  return server.post(`${OUTBOUND_URL}orm/v1/rosterRecord/export`, {
    ...data,
  });
}

/**
 * 获取文本
 * @returns {AxiosPromise<any>}
 */
export function doGetRecordText(data) {
  return server.post(`${OUTBOUND_URL}orm/v1/rosterRecord/recordText`, {
    ...data,
  });
}
