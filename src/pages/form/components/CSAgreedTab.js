import React, { Component } from 'react';
import { Tabs, Radio } from 'antd';
import ReactEcharts from 'echarts-for-react';

import FormSearchBar from './FormSearchBar';
import FormTabItemBar from './FormTabItemBar';
import FormChartOptionBar from './FormChartOptionBar';


const { TabPane } = Tabs;

const ChartOption = {
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
};

const columns = [
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
];
/**
 * 标准催收-同意还款报表
 */
class CSAgreedTab extends Component {
  constructor(props) {
    super(props);
    const { SearchBarProps } = props;
    this.state = ({
      formType: SearchBarProps.type,
    });
  }

  render() {
    const { SearchBarProps, export2Excel, onSearch, StatisticsData } = this.props;
    const chartOption = Object.assign({}, ChartOption);
    if (StatisticsData && StatisticsData.length > 0) {
      const category = [];
      const seriesData0 = [];
      const seriesData1 = [];
      for (let i = 0; i < StatisticsData.length; i++) {
        category.push(StatisticsData[i].timeFlag);
        const {
          totalCall, effectCall, totalContact, effectContact, promiseNum,
        } = StatisticsData[i];
        const jieTong = totalCall > 0 ? effectCall / totalCall : 0;
        const huanKuan = effectContact > 0 ? promiseNum / effectContact : 0;
        seriesData0.push(Math.floor(jieTong * 100) / 100); // 接通率
        seriesData1.push(Math.floor(huanKuan * 100) / 100); // 承诺还款率
      }
      chartOption.category = category;
      chartOption.series[0].data = seriesData0;
      chartOption.series[1].data = seriesData1;
    }
    return (

      <>
        <FormSearchBar
          SearchBarProps={SearchBarProps}
          export2Excel={export2Excel}
          onSearch={onSearch}
          formName='同意还款率'
          formId='CSAgreedTab'
        />
        <FormTabItemBar
          loading={false}
          column={columns}
          data={StatisticsData}
          keyId='date'
        />
        <ReactEcharts
          option={FormChartOptionBar(chartOption)}
          notMerge
          lazyUpdate
          // onEvents={onEvents}
          style={{ width: '100%', height: 400, marginTop: 50 }}
        />
      </>

    );
  }
}
export default CSAgreedTab;
