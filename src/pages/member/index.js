import React, { Component } from 'react';
import { connect } from 'dva';

import { createTable } from '@/components/Tables';
import ModalBar from '@/components/ModalBar';
import MemberSearchBar from './components/MemberSearchBar';
import MemberTableColumnBar from './components/MemberTableColumnBar';
import styles from './index.less';

// 用户Page
@connect(({ loading, memberActions }) => ({
  getMemberListLoading: loading.effects['memberActions/getMemberList'],
  memberList: memberActions.memberList,
  showModal: memberActions.showModal,
  pass: memberActions.pass,
}))
class MemberList extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberActions/getMemberList',
    });
  }

  // model确认
  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberActions/closeModel',
    });
  };

  render() {
    const {
      memberList, getMemberListLoading, showModal, pass,
    } = this.props;

    const column = MemberTableColumnBar(this.props);
    const TableComponent = createTable(column, memberList, 'operId', getMemberListLoading);
    return (
      <div className={styles.main}>
        <MemberSearchBar {...this.props}/>
        {TableComponent}
        <ModalBar loading={showModal} title='请记录临时密码' backText='确认' text={pass} handleOk={this.handleOk}/>
      </div>
    );
  }
}

export default MemberList;
