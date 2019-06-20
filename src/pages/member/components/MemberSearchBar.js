import React, { Component } from 'react';
import { Button, Input } from 'antd';
import router from 'umi/router';

import styles from './MemberSearchBar.less';

const { Search } = Input;

// 搜索组件
export default class MemberSearchBar extends Component {
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
  filterMember = () => {
    const { dispatch } = this.props;
    const { filterValue } = this.state;
    dispatch({
      type: 'memberActions/getMemberList',
      data: filterValue,
    });
  };

  // 跳转新增页面
  addNewMember = () => {
    router.push('/member/add');
  };

  // 重置
  resetFilter = () => {
    const { dispatch } = this.props;
    this.setState({
      filterValue: '',
    });
    dispatch({
      type: 'memberActions/getMemberList',
    });
  };

  render() {
    const { filterValue } = this.state;
    return (
      <div className={styles.main}>
        <Search
          className={styles.search}
          placeholder='请输入关键字：姓名，账号'
          onChange={this.handleInputChange}
          value={filterValue}
          onSearch={this.filterMember}
        />
        <Button className={styles.btn} type='primary' onClick={this.filterMember}>查询</Button>
        <Button className={styles.btn} onClick={this.resetFilter}>重置</Button>
        <Button className={styles.btn} type='primary' onClick={this.addNewMember}>新建</Button>
      </div>
    );
  }
}
