import React, { Component } from 'react';
import { Button, Input } from 'antd';
import router from 'umi/router';

import styles from './RoleSearchBar.less';

// 搜索组件
class RoleSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      filterValue: '',
    });
  }

  handleInputChange = (e) => {
    this.setState({
      filterValue: e.target.value,
    });
  };

  // 筛选角色列表
  filterRole = () => {
    const { dispatch } = this.props;
    const { filterValue } = this.state;
    dispatch({
      type: 'roleActions/getRoleList',
      data: filterValue,
    });
  };

  // 重置
  resetFilter = () => {
    const { dispatch } = this.props;
    this.setState({
      filterValue: '',
    });
    dispatch({
      type: 'roleActions/getRoleList',
    });
  };

  // 跳转新增页面
  addNewRole = () => {
    router.push('/role/add');
  };

  render() {
    const { filterValue } = this.state;

    return (
      <div className={styles.main}>
        <span>角色名称：</span>
        <Input id='input' placeholder='请输入关键字' value={filterValue} onChange={this.handleInputChange}/>
        <Button className={styles.btn} type='primary' onClick={this.filterRole}>查询</Button>
        <Button className={styles.btn} onClick={this.resetFilter}>重置</Button>
        <Button type='primary' onClick={this.addNewRole}>新建</Button>
      </div>
    );
  }
}

export default RoleSearchBar;
