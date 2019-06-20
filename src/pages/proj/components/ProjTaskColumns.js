import React from 'react';
import { Divider } from 'antd';
import Moment from 'moment';
import router from 'umi/router';
import { StatusType } from '@/utils/common';

// 列表表头组件
export default (props) => {
  return [
    // {
    //   title: '任务编号',
    //   dataIndex: 'taskNo',
    //   key: 'taskNo',
    // },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '任务说明',
      dataIndex: 'remark',
      key: 'remark',
    },

    {
      title: '有效人数',
      dataIndex: 'validCount',
      key: 'validCount',
    },
    {
      title: '审核进度',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (text, record) => {
        const item = StatusType({
          status: record.auditStatus,
          type: 'audit',
        });
        return item.text;
      },
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      key: 'taskStatus',
      render: (text, record) => {
        const { auditStatus, taskStatus } = record;
        if (!auditStatus || auditStatus < 3) {
          return '--';
        }
        const item = StatusType({
          status: taskStatus,
          type: 'task',
        });
        return item.text;
      },
    },
    {
      title: '发起人',
      dataIndex: 'createOper',
      key: 'createOper',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => {
        const { createTime } = record;
        if (!createTime || createTime === '') {
          return '';
        } else {
          return Moment(createTime).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        /** @namespace record.callId */
        /** @namespace record.recordFile */
        const { taskId } = record;
        return (
          <a href={`/task/${taskId}`}>查看</a>
        );
      },
    }];
};
