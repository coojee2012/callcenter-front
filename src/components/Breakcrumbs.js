import React from 'react';
import NavLink from 'umi/navlink';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

import styles from './Breakcrumbs.less';

// 面包屑路由配置
const routes = [
  { path: '/', breadcrumb: '首页' },
  { path: '/task', breadcrumb: '任务列表' },
  { path: '/task/add', breadcrumb: '新增任务' },
  { path: '/task/:id', breadcrumb: '任务详情' },
  { path: '/record', breadcrumb: '拨打记录' },
  { path: '/flow', breadcrumb: '流程列表' },
  { path: '/form', breadcrumb: '统计报表' },
  { path: '/form/business', breadcrumb: '业务报表' },
  { path: '/form/summary', breadcrumb: '汇总报表' },
  { path: '/role', breadcrumb: '角色列表' },
  { path: '/role/add', breadcrumb: '新建角色' },
  { path: '/role/:id', breadcrumb: '编辑角色' },
  { path: '/member', breadcrumb: '用户列表' },
  { path: '/member/add', breadcrumb: '新增用户' },
  { path: '/member/:id', breadcrumb: '编辑用户' },
  { path: '/user', breadcrumb: '个人信息' },
  { path: '/proj', breadcrumb: '项目管理' },
  { path: '/proj/add', breadcrumb: '新建项目' },
  { path: '/proj/:id', breadcrumb: '查看项目' },
  { path: '/roster', breadcrumb: '名单管理' },
  { path: '/roster/add', breadcrumb: '新建名单' },
  { path: '/roster/info', breadcrumb: '查看' },
  { path: '/roster/info/:id', breadcrumb: '名单' },
];

// 面包屑组件
export function createBreadcrumbs() {
  return withBreadcrumbs(routes)(({ breadcrumbs }) => {
    let newBreadcrumbs = [];
    if (breadcrumbs.length > 1) {
      breadcrumbs.forEach((item, index) => {
        if (index !== 0) {
          newBreadcrumbs.push(item);
        }
      });
    } else {
      newBreadcrumbs = breadcrumbs;
    }
    return (
      <div className={styles.main}>
        {newBreadcrumbs.map((breadcrumb, index) => (
          <span key={breadcrumb.key}>
            <NavLink to={breadcrumb.props.match.url}>
              {breadcrumb}
            </NavLink>
            {(index < newBreadcrumbs.length - 1) && <i> / </i>}
          </span>
        ))}
      </div>
    );
  });
}
