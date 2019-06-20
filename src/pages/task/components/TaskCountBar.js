import React from 'react';
import { Divider } from 'antd';

import styles from './TaskCountBar.less';

// 任务列表计数组件
export default (props) => {
  const { totalCount, totalCompleted } = props;
  return (
    <div className={styles.main}>
      <div className={styles.item}>
        <p className={styles.title}>总计任务</p>
        <p className={styles.content}>{totalCount}个</p>
      </div>
      <Divider className={styles.divider} type='vertical'/>
      <div className={styles.item}>
        <p className={styles.title}>审核通过的任务</p>
        <p className={styles.content}>{totalCompleted}个</p>
      </div>
    </div>
  );
};
