import React from 'react';

import { createBreadcrumbs } from '@/components/Breakcrumbs';
import { createStepBar } from '@/components/StepBar';
import styles from './index.less';

// 模拟数据
const data = {
  current: 5,
  progress: [
    {
      title: '创建',
      description: '',
    },
    {
      title: '部门审核',
      description: '',
    },
    {
      title: '财务复审',
      description: '',
    },
    {
      title: '完成',
      description: '',
    },
  ],
};

// 流程Page
export default () => {
  const Breadcrumb = createBreadcrumbs();
  const StepBar = createStepBar(data, '');
  return (
    <div>
      <Breadcrumb/>
      <div className={styles.main}>
        <span>默认流程：</span>
        {StepBar}
      </div>
    </div>
  );
};
