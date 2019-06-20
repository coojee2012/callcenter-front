import React from 'react';

import { createBreadcrumbs } from '@/components/Breakcrumbs';

// 用户Page Layout层
export default (props) => {
  const { children } = props;
  const Breadcrumb = createBreadcrumbs();
  return (
    <div>
      <Breadcrumb/>
      {children}
    </div>
  );
};
