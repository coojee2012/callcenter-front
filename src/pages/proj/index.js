import React, { Component } from 'react';
import { connect } from 'dva';

import { createBreadcrumbs } from '@/components/Breakcrumbs';
import { createTable } from '@/components/Tables';
import { PAGE_SIZE, PAGE_NUM } from '@/utils/constant';
import ProjSearchBar from './components/ProjSearchBar';
import ProjTableColumnBar from './components/ProjTableColumnBar';
import styles from './index.less';

@connect(({ loading, projActions }) => ({
  taskTypeList: projActions.taskTypeList,
  projList: projActions.projList,
  totalCount: projActions.totalCount,
  getProjListLoading: loading.effects['projActions/getProjList'],
}))
class ProjList extends Component {
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
      type: 'projActions/loadListPage',
    });
  }

  onSearch(data) {
    console.log('proj search data:', data);
    const { likeKeyWord, startTime, endTime, businessCode } = data;
    this.setState(Object.assign({}, { current: 1 }, data));
    const { dispatch } = this.props;
    dispatch({
      type: 'projActions/getProjList',
      data: {
        pageNum: 1,
        likeKeyWord,
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
      type: 'projActions/getProjList',
      data: {
        pageNum: page,
        likeKeyWord,
        startTime,
        businessCode,
        endTime,
      },
    });
  }

  render() {
    const Breadcrumb = createBreadcrumbs();
    const { getProjListLoading, totalCount, taskTypeList = [], projList = [] } = this.props;
    const { current } = this.state;
    const typeList = [];
    Object.assign(typeList, taskTypeList);
    const column = ProjTableColumnBar(this.props);
    typeList.push({ businessCode: '', createTime: 1553270400000, id: -1, typeName: '-请选择业务类型-' });
    const pagination = {
      pageSize: PAGE_SIZE,
      total: totalCount,
      current,
      onChange: (page, pageSize) => { this.onPageChange(page, pageSize); },
    };
    // projList.forEach((item, index) => {
    //   projList[index].rowKey = index;
    // });
    const TableComponent = createTable(column, projList, 'projectCode', getProjListLoading, 'middle', null, pagination);
    return (
      <div>
        <Breadcrumb />
        <div className={styles.main}>
          <ProjSearchBar typeList={typeList} onSearch={(data) => { this.onSearch(data); }} />
          {TableComponent}
        </div>
      </div>
    );
  }
}

export default ProjList;
