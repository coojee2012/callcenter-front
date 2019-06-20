import React, { Component } from 'react';
import { Tabs, Radio } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import qs from 'qs';
import { BASE_URL, BUSSINESS_CODE } from '@/utils/constant';

import CSAgreedTab from '../components/CSAgreedTab';
import YXAgreedTab from '../components/YXAgreedTab';
import ProjIntentionTab from '../components/ProjIntentionTab';
import styles from './index.less';

const { TabPane } = Tabs;

const SearchBarProps = {
  type: 'other',
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

const ProjIntentionSearchProps = {
  type: 'projectIntention',
  radio: {
    status: false,
    list: [],
  },
  search: {
    status: true,
    label: '项目名称',
  },
};

const FromInfos = [
  {
    id: '1',
    title: '催收业务',
    row_key: 'date',
    header: [
      {
        title: '日期',
        dataIndex: 'timeFlag',
        key: 'timeFlag',
      },
      {
        title: '总话务量',
        dataIndex: 'totalCall',
        key: 'totalCall',
      },
      {
        title: '有效话务量',
        dataIndex: 'effectCall',
        key: 'effectCall',
      },
      {
        title: '联系人数',
        dataIndex: 'totalContact',
        key: 'totalContact',
      },
      {
        title: '有效联系人数',
        dataIndex: 'effectContact',
        key: 'effectContact',
      },
      {
        title: '承诺还款人数',
        dataIndex: 'promiseNum',
        key: 'promiseNum',
      },
    ],
    option: {
      title: '催收业务对比图',
      legend: ['接通率', '承诺还款率'],
      category: [],
      // stack: '总量',
      type: 'line',
      series: [
        {
          name: '接通率',
          data: [],
          // type: 'line',
          // stack: '百分率',
        },
        {
          name: '承诺还款率',
          data: [],
          // type: 'line',
          // stack: '百分率',
        },
      ],
    },
  },
  {
    id: '2',
    title: '营销业务',
    row_key: 'date',
    header: [
      {
        title: '日期',
        dataIndex: 'timeFlag',
        key: 'timeFlag',
      },
      {
        title: '总话务量',
        dataIndex: 'totalCall',
        key: 'totalCall',
      },
      {
        title: '有效话务量',
        dataIndex: 'effectCall',
        key: 'effectCall',
      },
      {
        title: '联系人数',
        dataIndex: 'totalContact',
        key: 'totalContact',
      },
      {
        title: '有效联系人数',
        dataIndex: 'effectContact',
        key: 'effectContact',
      },
      {
        title: '有办卡意愿人数',
        dataIndex: 'willcardNum',
        key: 'willcardNum',
      },
    ],
    option: {
      title: '营销业务对比图',
      legend: ['接通率', '转换率'],
      category: [],
      stack: '总量',
      type: 'line',
      series: [
        {
          name: '接通率',
          data: [],
        },
        {
          name: '转换率',
          data: [],
        },
      ],
    },
  },
];
// 报表Page
@connect(({ loading, formActions }) => ({
  cuiShouStatisticsData: formActions.cuiShouStatisticsData,
  yinXiaoStatisticsData: formActions.yinXiaoStatisticsData,
  projectIntention: formActions.projectIntention,
  projectIntentionList: formActions.projectIntentionList,
  loadingData: loading.effects['formActions/getBusinessStatisticsData'],
}))
class BusinessFormList extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      useBusiness: BUSSINESS_CODE.CS_STAN,
    });
    this.onTabChange = this.onTabChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.export2Excel = this.export2Excel.bind(this);
  }

  componentWillMount() {
    // const { activeKey } = this.state;
    // const date = moment();
    // const startTime = date.startOf('month').format('YYYY-MM-DD 00:00:00');
    // const endTime = date.endOf('month').format('YYYY-MM-DD 23:59:59');
    // this.onSearch({ startTime, endTime, dateType: 0 }, activeKey);
  }

  onTabChange = (activeKey) => {
    console.log(`Tab Change TO: ${activeKey}`);
    if (activeKey === 'ProjIntenionTab') {
      const { dispatch } = this.props;
      const { useBusiness } = this.state;
      dispatch({
        type: 'formActions/getProjectIntention',
        businessCode: useBusiness,
      });
    }
    // const date = moment();
    // const startTime = date.startOf('month').format('YYYY-MM-DD 00:00:00');
    // const endTime = date.endOf('month').format('YYYY-MM-DD 23:59:59');
    // this.onSearch({ startTime, endTime, dateType: 0 }, activeKey);
  }

  onBusinessChange = (e) => {
    this.setState({ useBusiness: e.target.value });
  }


  onSearch(data, selectedTab) {
    const { useBusiness } = this.state;
    const { dispatch } = this.props;
    const { searchValue } = data;
    if (['CSAgreedTab', 'YXAgreedTab'].indexOf(selectedTab) > -1) {
      dispatch({
        type: 'formActions/getBusinessStatisticsData',
        data: Object.assign({}, data, { businessCode: useBusiness }),
      });
    } else if (selectedTab === 'ProjIntenionTab') {
      dispatch({
        type: 'formActions/getProjectIntentionData',
        data: Object.assign({}, data, { businessCode: useBusiness, likeKeyWord: searchValue }),
      });
    }
  }

  export2Excel = (data, activeKey) => {
    const businessCode = activeKey === '1' ? BUSSINESS_CODE.CS_STAN : BUSSINESS_CODE.YX_STAN;
    let { startTime, endTime } = data;
    const { dateType } = data;
    startTime = startTime ? startTime.replace(/-/g, '/') : '';
    endTime = endTime ? endTime.replace(/-/g, '/') : '';
    const qstr = qs.stringify({ startTime, endTime, dateType, businessCode }, { encode: true });
    const xlsUrl = `${BASE_URL}/report/excel/getBusinessSummary?${qstr}`;
    window.open(xlsUrl, '_blank');
  }


  render() {
    const { useBusiness } = this.state;
    const { cuiShouStatisticsData, yinXiaoStatisticsData, projectIntention, projectIntentionList } = this.props;

    return (
      <div className={styles.main}>
        <Radio.Group value={useBusiness} onChange={this.onBusinessChange} style={{ marginTop: 16 }}>
          <Radio.Button value={BUSSINESS_CODE.CS_STAN}>催收业务</Radio.Button>
          <Radio.Button value={BUSSINESS_CODE.YX_STAN}>营销业务</Radio.Button>
        </Radio.Group>
        {useBusiness === BUSSINESS_CODE.CS_STAN && (
          <Tabs defaultActiveKey='CSAgreedTab' onChange={activeKeyid => this.onTabChange(activeKeyid)}>
            <TabPane tab='承诺还款率' key='CSAgreedTab'>
              <CSAgreedTab
                SearchBarProps={SearchBarProps}
                export2Excel={this.export2Excel}
                onSearch={this.onSearch}
                StatisticsData={cuiShouStatisticsData}
              />
            </TabPane>
            <TabPane tab='项目意图' key='ProjIntenionTab'>
              <ProjIntentionTab
                SearchBarProps={ProjIntentionSearchProps}
                export2Excel={this.export2Excel}
                onSearch={this.onSearch}
                Intention={projectIntention}
                businessCode={useBusiness}
                Data={projectIntentionList}
              />
            </TabPane>
          </Tabs>
        )}
        {useBusiness === BUSSINESS_CODE.YX_STAN && (
          <Tabs defaultActiveKey='YXAgreedTab' onChange={activeKeyid => this.onTabChange(activeKeyid)}>
            <TabPane tab='转换率' key='YXAgreedTab'>
              <YXAgreedTab
                SearchBarProps={SearchBarProps}
                export2Excel={this.export2Excel}
                onSearch={this.onSearch}
                StatisticsData={yinXiaoStatisticsData}
              />
            </TabPane>
            <TabPane tab='项目意图' key='ProjIntenionTab'>
              <ProjIntentionTab
                SearchBarProps={ProjIntentionSearchProps}
                export2Excel={this.export2Excel}
                onSearch={this.onSearch}
                Intention={projectIntention}
                businessCode={useBusiness}
                Data={projectIntentionList}
              />
            </TabPane>
          </Tabs>
        )}
      </div>
    );
  }
}

export default BusinessFormList;
