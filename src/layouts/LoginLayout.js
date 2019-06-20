import React from 'react';
import DocumentTitle from 'react-document-title';

import FooterBar from '@/components/FooterBar';
import LoginForm from '@/components/LoginForm';
import styles from './LoginLayout.less';

// 登录图层
export default () => {
  // 配置动态title
  const pageTitle = () => {
    return '请登录!';
  };

  return (
    <DocumentTitle title={pageTitle()}>
      <div className={styles.main}>
        <div className={styles.logo}/>
        <div className={styles.title}>前置数据管理系统</div>
        <div className={styles.login}>
          <LoginForm/>
        </div>
        <FooterBar/>
      </div>
    </DocumentTitle>
  );
};
