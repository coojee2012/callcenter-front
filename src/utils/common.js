import Moment from 'moment';
import router from 'umi/router';
import ExportJsonExcel from 'js-export-excel';
import { isArray } from 'util';

/**
 * 导出excel
 * @param data
 * @param columns
 * @param fineName
 */
export function exportExcel(data, columns, fineName) {
  const option = {};
  option.fileName = fineName;
  option.datas = [
    {
      sheetData: data, // 数据
      sheetName: fineName, // 表名
      sheetHeader: columns, // 第一行标题
    },
  ];
  const toExcel = new ExportJsonExcel(option);
  toExcel.saveExcel();
}

/**
 * 格式化时间戳
 * @param timestamp
 * @returns {string}
 */
export function getDateTime(timestamp) {
  if (!timestamp) {
    return '';
  }
  const timestampNumber = parseInt(timestamp, 10);
  return Moment(timestampNumber).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 判断object是否为空
 * @param data
 * @returns {boolean}
 */
export function isEmptyObject(data) {
  // eslint-disable-next-line prefer-const
  for (let i in data) {
    return true;
  }
  return false;
}

/**
 * 错误码跳转
 * @param code
 */
export function responseCodePush(code) {
  switch (code) {
    case 401:
    case 403:
      router.push('/sysinfo/403');
      break;
    case 404:
      router.push('/sysinfo/404');
      break;
    case 500:
      router.push('/sysinfo/500');
      break;
    case 502:
      router.push('/sysinfo/502');
      break;
    case 10001:
      sessionStorage.clear();
      router.push('/login');
      break;
    default:
      break;
  }
}

export function getProjStatusName(status) {
  // 0.创建初始,无子任务 项目未开始 1.加入了子任务,未结束. 项目开始 2.项目结束
  const statusName = ['未开始', '进行中', '已结束'];
  return statusName[status] || '';
}

// 根据传入的名单数据，动态生成Table要素
export function dynamicNameTableData(nameList) {
  const nameColumns = [];
  const nameDatas = [];
  const nameCustormIds = [];
  let totalNames = 0;
  if (nameList && nameList.list && nameList.list.length) {
    totalNames = nameList.totalCount || 0;
    for (let i = 0; i < nameList.list.length; i++) {
      const data = {};
      const item = nameList.list[i];
      data.customerId = item.customerId;
      // if (i === 0) {
      //   nameColumns.push({
      //     title: '客户编号',
      //     dataIndex: 'customerId',
      //     key: 'customerId',
      //   });
      // }
      const itemValueList = item.valueList;
      if (itemValueList && itemValueList.length) {
        for (let j = 0; j < itemValueList.length; j++) {
          const { columnCode, name, dataValue } = itemValueList[j];
          data[columnCode] = dataValue;
          if (i === 0) {
            nameColumns.push({
              title: name,
              dataIndex: columnCode,
              key: columnCode,
            });
          }
        }
      }
      nameCustormIds.push(item.customerId); // TODO 会不会有重复的ID？需要去重吗？
      nameDatas.push(data);
    }
  }

  return { nameColumns, nameDatas, totalNames, nameCustormIds };
}


export function findItemByKey(arrayObj, k, v) {
  let o = null;
  if (!isArray(arrayObj)) {
    return o;
  }
  for (let i = 0; i < arrayObj.length; i++) {
    const keys = Object.keys(arrayObj[i]);
    if (keys.indexOf(k) > -1 && arrayObj[i][k] === v) {
      o = arrayObj[i];
      break;
    }
  }
  return o;
}

export function StatusType(data) {
  // 审核状态: -1.审核不通过 0.待审核 1.主动撤回 2.审核中 3.审核通过
  // 任务状态: 1.待上传 2.已上传 3.进行中 4.已完成
  let item = {
    status: 'normal',
    text: '无法识别',
    percent: 0,
  };
  switch (data.type) {
    case 'audit':
      switch (data.status) {
        case -1:
          item = {
            status: 'exception',
            text: '审核不通过',
            percent: 100,
          };
          break;
        case 0:
          item = {
            status: 'normal',
            text: '待审核',
            percent: 0,
          };
          break;
        case 1:
          item = {
            status: 'exception',
            text: '主动撤回',
            percent: 0,
          };
          break;
        case 2:
          item = {
            status: 'active',
            text: '审核中',
            percent: 50,
          };
          break;
        case 3:
          item = {
            status: 'success',
            text: '审核通过',
            percent: 100,
          };
          break;
        default:
          item = {
            status: 'normal',
            text: '无法识别',
            percent: 0,
          };
      }
      break;
    default:
      switch (data.status) {
        case 1:
          item = {
            status: 'normal',
            text: '待上传',
            percent: 25,
          };
          break;
        case 2:
          item = {
            status: 'normal',
            text: '已上传',
            percent: 50,
          };
          break;
        case 3:
          item = {
            status: 'active',
            text: '进行中',
            percent: 75,
          };
          break;
        case 4:
          item = {
            status: 'success',
            text: '执行完毕',
            percent: 100,
          };
          break;
        default:
          item = {
            status: 'normal',
            text: '无法识别',
            percent: 0,
          };
      }
      break;
  }
  return item;
}
