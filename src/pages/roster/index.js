import React, { Component } from 'react';
import { connect } from 'dva';
import { createBreadcrumbs } from '@/components/Breakcrumbs';
import { createTable } from '@/components/Tables';
import { PAGE_SIZE } from '@/utils/constant';

import RosterSearchBar from './components/RosterSearchBar';
import RosterListColumn from './components/RosterListColumn';
import ImportNameModal from './components/ImportNameModal';
import styles from './index.less';

@connect(({ loading, rosterActions }) => ({
  taskTypeList: rosterActions.taskTypeList,
  rosterList: rosterActions.rosterList,
  totalCount: rosterActions.totalCount,
  openImportNameModal: rosterActions.openImportNameModal,
  importNameCode: rosterActions.importNameCode,
  loadingRosterList: loading.effects['rosterActions/getRosterList'],
}))
class RosterList extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      current: 1,
      likeKeyWord: '',
      businessCode: '',
      startTime: '',
      endTime: '',
      selectedRowKeys: '',
    });
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rosterActions/loadListPage',
    });
  }

  onSearch(data) {
    console.log('roster search data:', data);
    const { likeKeyWord, startTime, endTime, businessCode } = data;
    this.setState(Object.assign({}, { current: 1 }, data));
    const { dispatch } = this.props;
    dispatch({
      type: 'rosterActions/getRosterList',
      data: {
        pageNum: 1,
        matchingSeq: likeKeyWord,
        businessCode,
        startTime,
        endTime,
      },
    });
  }

  onPageChange(page) {
    const { likeKeyWord, startTime, endTime, businessCode } = this.state;
    this.setState({ current: page });
    const { dispatch } = this.props;
    dispatch({
      type: 'rosterActions/getRosterList',
      data: {
        pageNum: page,
        matchingSeq: likeKeyWord,
        startTime,
        businessCode,
        endTime,
      },
    });
  }

  closeImportModel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rosterActions/closeImportModel',
    });
  }

  render() {
    const { loadingRosterList, dispatch, totalCount, taskTypeList = [], rosterList = [], openImportNameModal, importNameCode } = this.props;
    const { current } = this.state;
    const Breadcrumb = createBreadcrumbs();
    const typeList = [];
    Object.assign(typeList, taskTypeList);
    const column = RosterListColumn(this.props);
    typeList.push({ businessCode: '', createTime: 1553270400000, id: -1, typeName: '-请选择业务类型-' });
    const pagination = {
      pageSize: PAGE_SIZE,
      total: totalCount,
      current,
      onChange: (page, pageSize) => { this.onPageChange(page, pageSize); },
    };
    const TableComponent = createTable(column, rosterList, 'callId', loadingRosterList, 'middle', null, pagination);
    return (
      <div>
        <Breadcrumb/>
        <div className={styles.main}>
          <RosterSearchBar typeList={typeList} onSearch={(data) => { this.onSearch(data); }} />
          { TableComponent }
        </div>
        <ImportNameModal loading={openImportNameModal} dispatch={dispatch} nameCode={importNameCode} onCancel={() => { this.closeImportModel(); }} />
      </div>
    );
  }
}

export default RosterList;
