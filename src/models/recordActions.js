import { message } from 'antd';

import {
  doGetTaskTypeList,
} from '@/servers/taskApi';

import {
  doGetRecordList, doGetExportVoiceTag, doGetExportExcelTag, doGetRecordText,
} from '@/servers/recordApi';
import { OUTBOUND_URL } from '@/utils/constant';

export default {
  namespace: 'recordActions',
  state: {
    recordList: [],
    totalCount: 0,
    recordTextList: [],
    taskTypeList: [],
  },
  reducers: {
    showRecordList(state, { data }) {
      return { ...state, ...data };
    },
    showRecordTextList(state, { recordTextList }) {
      return { ...state, recordTextList };
    },
  },
  effects: {
    * getRecordList({ data }, { call, put }) {
      const resTypeList = yield call(doGetTaskTypeList);
      const resp = yield call(doGetRecordList, data);
      if (resTypeList.data.success && resp.data.success) {
        yield put({
          type: 'showRecordList',
          data: {
            totalCount: resp.data.data.totalCount,
            recordList: resp.data.data.list,
            taskTypeList: resTypeList.data.data,
          },
        });
      } else {
        message.error(resp.data.msg);
      }
    },
    * getExportVoice({ data }, { call, put }) {
      const resp = yield call(doGetExportVoiceTag, data);
      const downloadUrl = `${OUTBOUND_URL}orm/record/exportVoice/`;
      window.open(downloadUrl + resp.data.data);
    },
    * getExportExcel({ data }, { call, put }) {
      const resp = yield call(doGetExportExcelTag, data);
      const downloadUrl = `${OUTBOUND_URL}orm/v1/rosterRecord/export/`;
      window.open(downloadUrl + resp.data.data);
    },
    * getRecordText({ data }, { call, put }) {
      const resp = yield call(doGetRecordText, data);
      if (resp.data.returnCode === 1) {
        yield put({
          type: 'showRecordTextList',
          recordTextList: resp.data.data.list,
        });
      } else {
        message.error(resp.data.msg);
      }
    },
  },
  subscriptions: {},
};
