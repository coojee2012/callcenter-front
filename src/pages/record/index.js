import React, { Component } from 'react';
import { connect } from 'dva';

import { createBreadcrumbs } from '@/components/Breakcrumbs';
import { createTable } from '@/components/Tables';
import RecordSearchBar from './components/RecordSearchBar';
import RecordTableColumnBar from './components/RecordTableColumnBar';
import styles from './index.less';
import { PAGE_SIZE, PAGE_NUM } from '@/utils/constant';
// 录音Page
@connect(({ loading, recordActions }) => ({
  recordList: recordActions.recordList,
  totalCount: recordActions.totalCount,
  taskTypeList: recordActions.taskTypeList,
  getRecordListLoading: loading.effects['recordActions/getRecordList'],
}))
class RecordList extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      current: 1,
      likeKeyWord: '',
      startTime: '',
      endTime: '',
      selectedRowKeys: '',
    });
  }

  componentWillMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'recordActions/getRecordList',
    //   data: {
    //     pageNum: 1,
    //   },
    // });
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };

  onExportVoices(selectedRowKeys) {
    const { dispatch } = this.props;
    dispatch({
      type: 'recordActions/getExportVoice',
      data: {
        callIds: selectedRowKeys,
      },
    });
  }

  onSearch(data) {
    const { likeKeyWord, startTime, endTime } = data;
    this.setState(Object.assign({}, { current: 1 }, data));
    const { dispatch } = this.props;
    dispatch({
      type: 'recordActions/getRecordList',
      data: {
        pageNum: 1,
        likeKeyWord,
        startTime,
        endTime,
      },
    });
  }

  onPageChange(page) {
    const { likeKeyWord, startTime, endTime } = this.state;
    this.setState({ current: page });
    const { dispatch } = this.props;
    dispatch({
      type: 'recordActions/getRecordList',
      data: {
        pageNum: page,
        likeKeyWord,
        startTime,
        endTime,
      },
    });
  }

  render() {
    const { selectedRowKeys, current } = this.state;
    const { recordList, getRecordListLoading, totalCount, taskTypeList } = this.props;
    const column = RecordTableColumnBar(this.props);
    const Breadcrumb = createBreadcrumbs();
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const typeList = [];
    Object.assign(typeList, taskTypeList);
    typeList.push({ businessCode: '', createTime: 1553270400000, id: -1, typeName: '-请选择业务类型-' });

    const pagination = {
      pageSize: PAGE_SIZE,
      total: totalCount,
      current,
      onChange: (page, pageSize) => { this.onPageChange(page, pageSize); },
    };
    const TableComponent = createTable(column, recordList, 'callId', getRecordListLoading, 'middle', rowSelection, pagination);
    return (
      <div>
        <Breadcrumb/>
        <div className={styles.main}>
          <RecordSearchBar
            typeList={typeList}
            onSearch={(data) => { this.onSearch(data); }}
            onExportVoices={(data) => { this.onExportVoices(data); }}
            selectedRowKeys={selectedRowKeys}
          />
          {TableComponent}
        </div>
      </div>
    );
  }
}

export default RecordList;
