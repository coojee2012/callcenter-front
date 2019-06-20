import { server } from '@/utils/axios';
import { LOAD_SIZE, PAGE_NUM } from '@/utils/constant';

/**
 * 查询角色列表接口
 * @returns {AxiosPromise<any>}
 */
export function doGetRoleList(data) {
  if (data) {
    return server.get(`sys/roleList?pageNum=${PAGE_NUM}&pageSize=${LOAD_SIZE}&roleNameLike=${data}`);
  } else {
    return server.get(`sys/roleList?pageNum=${PAGE_NUM}&pageSize=${LOAD_SIZE}`);
  }
}

/**
 * 查询角色详情接口
 * @returns {AxiosPromise<any>}
 */
export function doGetRoleInfo(data) {
  return server.get(`/sys/roleDetail?roleId=${data.roleId}`);
}

/**
 * 新增角色接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doAddRole(data) {
  return server.post('/sys/addRole', data);
}

/**
 * 更新角色接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doUpdateRole(data) {
  return server.put('sys/roleUpdate', data);
}

/**
 * 删除角色接口
 * @param data
 * @returns {AxiosPromise<any>}
 */
export function doDelRole(data) {
  return server.delete(`sys/roleDelete?roleId=${data.roleId}`);
}

/**
 * 获取资源（权限）列表接口
 * @returns {AxiosPromise<any>}
 */
export function doGetResourceList() {
  return server.get('sys/resourceList');
}
