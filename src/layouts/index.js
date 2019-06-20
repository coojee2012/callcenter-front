/**
 * Routes:
 *   - ./src/components/Authorized.js
 */
import React from 'react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import LoginLayout from './LoginLayout';
import BaseLayout from './BaseLayout';

moment.locale('zh-cn');

// 默认图层
export default (props) => {
  const { children } = props;

  if (sessionStorage.length < 1 || props.location.pathname === '/login') {
    return (
      <LocaleProvider locale={zh_CN}>
        <LoginLayout>{children}</LoginLayout>
      </LocaleProvider>
    );
  } else if (props.location.pathname === '/403' || props.location.pathname === '/404' || props.location.pathname === '/500') {
    return (
      <LocaleProvider locale={zh_CN}>
        {children}
      </LocaleProvider>
    );
  }

  return (
    <LocaleProvider locale={zh_CN}>
      <BaseLayout>
        {children}
      </BaseLayout>
    </LocaleProvider>
  );
};
