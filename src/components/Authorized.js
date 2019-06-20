import React from 'react';
import router from 'umi/router';

export default (props) => {
  const { isLogin, authUrl, rootFlag } = sessionStorage;
  const { children } = props;
  const path = children.props.location.pathname;
  if (!isLogin && path === '/sysinfo/500') {
    router.push('/sysinfo/502');
    return null;
  } else if (path === '/sysinfo/502') {
    return <div style={{ height: '100%' }}>连接服务器错误</div>;
  } else if (!isLogin && children.props.location.pathname !== '/login') {
    router.push('/login');
    return null;
  } else if (isLogin && children.props.location.pathname === '/login') {
    router.push('/');
    return null;
  } else if (rootFlag === '1') {
    return <div style={{ height: '100%' }}>{children}</div>;
  } else if (isLogin && authUrl && authUrl === '[]') {
    return <div style={{ height: '100%' }}>{children}</div>;
  } else if (authUrl) {
    const authList = JSON.parse(authUrl);
    let isAuth = false;
    for (const item of authList) {
      const reg = new RegExp(`^${item.item}`);
      if (['/login', '/', '/sysinfo/403', '/sysinfo/404', '/sysinfo/500', '/sysinfo/502'].indexOf(path) > -1) {
        isAuth = true;
        break;
      } else if (item.item !== '/' && reg.test(path)) {
        isAuth = true;
        break;
      }
    }
    if (isAuth) {
      return <div style={{ height: '100%' }}>{children}</div>;
    } else {
      router.push('/sysinfo/403');
      return null;
    }
  } else {
    return <div style={{ height: '100%' }}>{children}</div>;
  }
};
