import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Avatar, Menu, Dropdown, Icon,
} from 'antd';

import styles from './HeaderBar.less';

// 头部Header图层
@connect()
class HeaderBar extends Component {
  bindLogout() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userActions/logout',
    });
    router.push('/login');
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key='logout'>
          <a onClick={this.bindLogout.bind(this)} href='javascript:void(0);'><Icon type='logout'/>登出</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <div className={styles.user}>
          <Avatar icon='user' className={styles.avatar}/>
          <Dropdown overlay={menu}>
            <span>{sessionStorage.getItem('operName')}<Icon type='down'/></span>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default HeaderBar;
