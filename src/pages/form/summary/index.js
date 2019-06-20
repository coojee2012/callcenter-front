import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Tabs, Spin, Table, Button, Row, Col, message,
} from 'antd';
import moment from 'moment';
import FormTabItemBar from '@/pages/form/components/FormTabItemBar';
import {
  TaskSummaryColumn, CallSummaryColumn, ProjectSummaryColumn, ProjectDailySummaryColumn,
  ProjectDailySummaryColumnNew,
} from '@/pages/form/components/SummaryColumnBar';
import FormSearchBar from '@/pages/form/components/FormSearchBar';
import qs from 'qs';
import styles from './index.less';
import { BASE_URL } from '@/utils/constant';


const { TabPane } = Tabs;

// 搜索栏参数
const TaskSearchProps = {
  type: 'task',
  radio: {
    status: false,
    list: [],
  },
  search: {
    status: true,
    label: '任务名称',
  },
};

const ProjectSearchProps = {
  type: 'project',
  radio: {
    status: false,
    list: [],
  },
  search: {
    status: true,
    label: '项目名称',
  },
};

const CallSearchProps = {
  type: 'call',
  radio: {
    status: true,
    list: [
      {
        value: 'week',
        text: '周报表',
      },
      {
        value: 'month',
        text: '月报表',
      },
      {
        value: 'quarter',
        text: '季报表',
      },
      {
        value: 'year',
        text: '年报表',
      },
    ],
  },
  search: {
    status: false,
    label: '',
  },
};

// 报表Page
@connect(({ loading, formActions }) => ({
  getSummaryFormLoading: loading.effects['formActions/getSummaryForm'],
  summaryTaskList: formActions.summaryTaskList,
  summaryProjList: formActions.summaryProjList,
  summaryCallList: formActions.summaryCallList,
  summaryProjDailyList: formActions.summaryProjDailyList,
}))
class SummaryFormList extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      activeKey: '0',
      startTime: '',
      endTime: '',
    });
    this.onTabChange = this.onTabChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.export2Excel = this.export2Excel.bind(this);
  }

  componentWillMount() {
    const startTime = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
    const endTime = moment().format('YYYY-MM-DD 23:59:59');
    this.onSearch({
      startTime, endTime, dateType: 0, formType: 'task', searchValue: '',
    });
  }

  onTabChange(activeKey) {
    this.setState({
      activeKey,
    });
    const date = moment();
    const startTime = date.startOf('month').format('YYYY-MM-DD 00:00:00');
    const endTime = date.endOf('month').format('YYYY-MM-DD 23:59:59');
    const formTypes = ['task', 'call', 'project', 'projectDaily', 'other'];
    const formType = formTypes[activeKey + 0];
    this.onSearch({
      startTime, endTime, dateType: 0, formType, searchValue: '',
    }, activeKey);
  }

  onSearch(data) {
    const { dispatch } = this.props;
    const { startTime, endTime } = data;
    this.setState({
      startTime,
      endTime,
    });
    dispatch({
      type: 'formActions/getSummaryForm',
      data: Object.assign({}, data),
    });
  }

  export2Excel = (data, activeKey) => {
    let url = '';
    switch (activeKey) {
      case '0':
        url = 'report/excel/getTaskSummary';
        break;
      case '1':
        url = 'report/excel/getOutcallSummary';
        break;
      case '2':
        url = 'report/excel/projectSummary';
        break;
      default:
        break;
    }
    if (url === '') {
      message.error('错误的导出类型！');
      return;
    }
    let { startTime, endTime } = data;
    const { dateType, searchValue } = data;
    startTime = startTime ? startTime.replace(/-/g, '/') : '';
    endTime = endTime ? endTime.replace(/-/g, '/') : '';
    const qstr = qs.stringify({ startTime, endTime, dateType, taskName: searchValue, likeKeyWord: searchValue }, { encode: true });
    const xlsUrl = `${BASE_URL}${url}?${qstr}`;
    window.open(xlsUrl, '_blank');
  }


  export2ProjHistoryExcel = (projectCode) => {
    const url = 'report/excel/projectSummaryHistory';
    // let { startTime, endTime } = this.state;
    // startTime = startTime ? startTime.replace(/-/g, '/') : '';
    // endTime = endTime ? endTime.replace(/-/g, '/') : '';
    const qstr = qs.stringify({ projectCode }, { encode: true });
    const xlsUrl = `${BASE_URL}${url}?${qstr}`;
    window.open(xlsUrl, '_blank');
  }

  getProjDailyTableData = () => {
    const { summaryProjDailyList = [] } = this.props;
    const projects = [];
    const projectsDays = [];
    const list = [];
    let projectIndex = 0;
    let projectDialLength = 0;
    for (let i = 0; i < summaryProjDailyList.length; i++) {
      const { date, projectName, rosterNum, dialInfos = [] } = summaryProjDailyList[i];
      const dialInfoLength = dialInfos.length;

      for (let j = 0; j < dialInfoLength; j++) {
        const { dialedRoster, answeredNum, stopPhone, blankNum } = dialInfos[j];
        const item = {
          date, projectName, rosterNum, dialedRoster, answeredNum, stopPhone, blankNum, rowSpanProject: 0, rowSpanDialInfo: 0, key: list.length,
        };
        if (projects.indexOf(projectName) < 0) {
          projects.push(projectName);
          if (list.length) {
            list[projectIndex].rowSpanProject = projectDialLength;
          }
          projectIndex = list.length;
          projectDialLength = 0;
        }
        if (projectsDays.indexOf(`${projectName}_${date}`) < 0) {
          projectsDays.push(`${projectName}_${date}`);
          item.rowSpanDialInfo = dialInfoLength;
        }
        projectDialLength += 1;
        list.push(item);
      }
    }
    if (list.length) {
      list[projectIndex].rowSpanProject = projectDialLength;
    }
    const projectDailyColumns = ProjectDailySummaryColumn();
    return { projectDailyColumns, projectDailyData: list };
  }

  onExpandChange = (expanded, record) => {
    const { projectCode } = record;
    const { dispatch } = this.props;
    const { startTime, endTime } = this.setState;
    if (expanded) {
      dispatch({
        type: 'formActions/getProjectDaily',
        data: Object.assign({}, { projectCode, startTime, endTime }),
      });
    }
  }

  expandedRowRender = (record, index, indent, expanded) => {
    const { projectCode } = record;
    const { summaryProjDailyList = {} } = this.props;
    const cc = () => {
      this.export2ProjHistoryExcel(projectCode);
    };

    return <Table columns={ProjectDailySummaryColumnNew(cc)} rowKey='recordTime' dataSource={summaryProjDailyList[projectCode]} pagination={false} />;
  }

  render() {
    const {
      summaryTaskList, summaryCallList, getSummaryFormLoading, summaryProjList,
    } = this.props;
    const { activeKey } = this.state;
    // const { projectDailyColumns, projectDailyData } = this.getProjDailyTableData();
    return (

      <div className={styles.main}>
        <Tabs defaultActiveKey={activeKey} onChange={activeKeyid => this.onTabChange(activeKeyid)}>
          <TabPane tab='任务拨打汇总' key='0'>
            <FormSearchBar
              SearchBarProps={TaskSearchProps}
              formName='任务拨打汇总'
              export2Excel={this.export2Excel}
              onSearch={this.onSearch}
              formId='0'
            />
            <FormTabItemBar
              loading={getSummaryFormLoading}
              column={TaskSummaryColumn}
              data={summaryTaskList}
              keyId='uuid'
            />
          </TabPane>
          <TabPane tab='项目拨打汇总' key='2'>
            <FormSearchBar
              SearchBarProps={ProjectSearchProps}
              formName='项目拨打汇总'
              export2Excel={this.export2Excel}
              onSearch={this.onSearch}
              formId='2'
            />

            <Spin
              tip='正在加载...'
              spinning={getSummaryFormLoading}
            >
              <Table
                style={{ marginTop: '50px' }}
                expandedRowRender={this.expandedRowRender}
                onExpand={this.onExpandChange}
                bordered
                columns={ProjectSummaryColumn}
                dataSource={summaryProjList}
                pagination={false}
                rowKey={record => record.projectCode}
              />
            </Spin>
          </TabPane>
          <TabPane tab='外呼拨打报表' key='1'>
            <FormSearchBar
              SearchBarProps={CallSearchProps}
              export2Excel={this.export2Excel}
              formName='外呼拨打报表'
              onSearch={this.onSearch}
              formId='1'
            />
            <FormTabItemBar
              loading={getSummaryFormLoading}
              column={CallSummaryColumn}
              data={summaryCallList}
              keyId='timeFlag'
            />
          </TabPane>

        </Tabs>
      </div>
    );
  }
}

export default SummaryFormList;
