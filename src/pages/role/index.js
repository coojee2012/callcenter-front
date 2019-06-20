import React, { Component } from 'react';
import { connect } from 'dva';

import { createTable } from '@/components/Tables';
import RoleTableColumnBar from './components/RoleTableColumnBar';
import RoleSearchBar from './components/RoleSearchBar';
import styles from './index.less';

// 角色Page
@connect(({ loading, roleActions }) => ({
  getRoleListLoading: loading.effects['roleActions/getRoleList'],
  roleList: roleActions.roleList,
}))
class RoleList extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleActions/getRoleList',
    });
  }

  render() {
    const { roleList, getRoleListLoading } = this.props;
    const column = RoleTableColumnBar(this.props);
    const TableComponent = createTable(column, roleList, 'roleId', getRoleListLoading);

    return (
      <div className={styles.main}>
        <RoleSearchBar {...this.props}/>
        {TableComponent}
      </div>
    );
  }
}

export default RoleList;
