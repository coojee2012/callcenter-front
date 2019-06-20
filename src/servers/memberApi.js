import { server } from '@/utils/axios';
import { LOAD_SIZE, PAGE_NUM } from '@/utils/constant';

/**
 * 查询操作员列表接口
 * @returns {AxiosPromise<any>}
 */
export function doGetMemberList(data) {
  return server.post('user/findall', {
    pageNum: PAGE_NUM,
    pageSize: LOAD_SIZE,
    validFlag: 1,
    keyWord: data,
  });
}

/**
 * 查询操作员详情接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doGetMemberInfo(data) {
  return server.get(`user/${data}`);
}

/**
 * 新建操作员接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doRegisterMember(data) {
  return server.post('user/register', data);
}

/**
 * 更新操作员接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doUpdateMember(data) {
  return server.post('user/update', data);
}

/**
 * 删除操作员接口
 * @param data
 * @returns {AxiosPromise}
 */
export function doDeleteMember(data) {
  return server.delete(`user/deleteOper?operId=${data}`);
}

/**
 * 重置密码接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doResetMemberPwd(data) {
  return server.post('user/resetPwd', data);
}
