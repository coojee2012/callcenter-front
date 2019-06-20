import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';

import SiderBarItem from './SiderBarItem';
import styles from './SiderBar.less';

const { SubMenu } = Menu;

// 侧边栏图层
@withRouter
class SiderBar extends Component {
  constructor(props) {
    super(props);
    const { location } = props;
    const key = location.pathname.split('/')[1] === '' ? 'main' : location.pathname.split('/')[1];
    if (key === 'form') {
      const secKey = location.pathname.split('/')[1] === '' ? 'main' : location.pathname.split('/')[2];
      this.state = {
        defaultOpenKeys: [key],
        defaultSelectedKey: secKey,
      };
    } else {
      this.state = {
        defaultOpenKeys: [],
        defaultSelectedKey: key,
      };
    }
  }

  changeMenu = (e) => {
    this.setState({
      defaultSelectedKey: e.key,
    });
  };

  getLogoClass = () => {
    const tenantCode = sessionStorage.getItem('tenantCode');
    let logoClass = 'logo';
    switch (tenantCode) {
      case 'CDRCB':
        logoClass += '_cdns';
        break;
      case 'crcbbank':
        logoClass += '_csns';
        break;
      case 'LINY_ICBC':
        logoClass += '_icbc';
        break;
      default:
        break;
    }
    return logoClass;
  }

  render() {
    const { showLogo } = this.props;
    const { authUrl, rootFlag } = sessionStorage;
    const authList = JSON.parse(authUrl);
    const usedUrl = []; // 防止重复的菜单项，TODO 后端不应该返回重复的x
    const logoClass = this.getLogoClass();
    return (
      <div>
        {showLogo && (
          <div className={styles.logo_container}>
            <div className={styles[logoClass]}/>
          </div>
        )}
        <Menu
          onClick={this.changeMenu}
          defaultSelectedKeys={[this.state.defaultSelectedKey]}
          defaultOpenKeys={this.state.defaultOpenKeys}
          mode='inline'
          theme='dark'
        >
          <Menu.Item key='main'>
            <Link to='/'>
              <Icon type='home'/>
              <span>主页</span>
            </Link>
          </Menu.Item>

          {authList.map((item, index) => {
            const url = item.item.split('/')[1];
            if (usedUrl.indexOf(url) > -1) {
              return null;
            }
            usedUrl.push(url);
            if (url === 'form') {
              return (
                <SubMenu key='form' title={<span><Icon type='table'/><span>统计报表</span></span>}>
                  <Menu.Item key='summary'>
                    <Link to='/form/summary'>
                      <Icon type='profile'/>
                      <span>汇总报表</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key='business'>
                    <Link to='/form/business'>
                      <Icon type='layout'/>
                      <span>业务报表</span>
                    </Link>
                  </Menu.Item>
                </SubMenu>
              );
            } else if (!url || ['flow', 'member', 'role'].indexOf(url) > -1) {
              return null;
            } else {
              return (
                <Menu.Item key={url}>
                  <SiderBarItem url={item.item} menu={url}/>
                </Menu.Item>
              );
            }
          })}

          {rootFlag === '1' && (
            <Menu.Item key='/roleManage'>
              <SiderBarItem url='/role' menu='role'/>
            </Menu.Item>
          )}
          {rootFlag === '1' && (
            <Menu.Item key='/memberManage'>
              <SiderBarItem url='/member' menu='member'/>
            </Menu.Item>
          )}

        </Menu>
      </div>
    );
  }
}

export default SiderBar;
