import React, { Component } from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';


const menuText = (key) => {
  let icon = '';
  let text = '';
  switch (key) {
    case 'task':
      icon = 'file-done';
      text = '任务管理';
      break;
    case 'record':
      icon = 'phone';
      text = '拨打记录';
      break;
    case 'role':
      icon = 'idcard';
      text = '角色管理';
      break;
    case 'member':
      icon = 'team';
      text = '用户管理';
      break;
    case 'user':
      icon = 'setting';
      text = '个人设置';
      break;
    case 'proj':
      icon = 'project';
      text = '项目管理';
      break;
    case 'roster':
      icon = 'team';
      text = '名单管理';
      break;
    default:
      break;
  }
  return {
    icon,
    text,
  };
};

export default class SiderBarItem extends Component {
  render() {
    const { url, menu } = this.props;
    const item = menuText(menu);
    return (
      <Link to={url}>
        <Icon type={item.icon}/>
        <span>{item.text}</span>
      </Link>
    );
  }
}
