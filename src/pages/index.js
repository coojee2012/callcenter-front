import React from 'react';
import router from 'umi/router';

import styles from './index.less';

// 默认主页面
export default () => {
  const initialFlag = sessionStorage.getItem('initialFlag');
  if (initialFlag === '1') {
    router.push('/user');
    return null;
  }
  return (
    <div className={styles.main}>
      <p>智能外呼前置数据管理系统</p>
    </div>
  );
};
