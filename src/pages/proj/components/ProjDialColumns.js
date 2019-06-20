import React from 'react';
import { Divider } from 'antd';
import Moment from 'moment';

// 列表表头组件
export default (props) => {
  return [
    {
      title: '编号',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
    },
    {
      title: '性别',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
    },
  ];
};
