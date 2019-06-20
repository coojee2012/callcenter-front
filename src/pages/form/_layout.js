import React from 'react';

import { createBreadcrumbs } from '@/components/Breakcrumbs';

// 报表Layout层
export default (props) => {
  const Breadcrumb = createBreadcrumbs();
  const { children } = props;
  return (
    <div>
      <Breadcrumb/>
      {children}
    </div>
  );
};
