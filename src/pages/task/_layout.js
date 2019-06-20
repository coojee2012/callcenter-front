import React from 'react';

import { createBreadcrumbs } from '@/components/Breakcrumbs';
import styles from './index.less';

// 任务管理默认图层
export default (props) => {
  const Breadcrumb = createBreadcrumbs();
  const { children } = props;
  return (
    <div className={styles.main}>
      <Breadcrumb/>
      {children}
    </div>
  );
};
