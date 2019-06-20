import React from 'react';
import { Table, Spin } from 'antd';

import { PAGE_SIZE, PAGE_NUM } from '@/utils/constant';
import styles from './Tables.less';

export function createTable(columns, data, id, loading, size = 'middle', rowSelection = null, pagination = null, style = null) {
  const selectionProps = rowSelection ? { rowSelection } : {};
  const Pagination = pagination || false;
  // {
  //   disabled: true,
  //   defaultPageSize: PAGE_SIZE,
  //   defaultCurrent: PAGE_NUM,
  //   hideOnSinglePage: true,
  // };
  return (
    <Spin
      tip='正在加载...'
      spinning={loading}
    >
      <Table
        {...selectionProps}
        className={styles.main}
        style={style}
        size={size}
        bordered
        columns={columns}
        dataSource={data}
        pagination={Pagination}
        rowKey={record => record[id]}
      />
    </Spin>
  );
}
