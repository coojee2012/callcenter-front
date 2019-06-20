import Moment from 'moment';
import React from 'react';
import {
  Button, Row, Col,
} from 'antd';

export const TaskSummaryColumn = [
  {
    title: '任务名称',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: '状态',
    key: 'status',
    render: (text, record) => {
      switch (record.taskStatus) {
        case 0:
          return '未开始';
        case 1:
          return '进行中';
        case 2:
          return '已完成';
        default:
          return '未知';
      }
    },
  },
  {
    title: '开始时间',
    // dataIndex: 'startTime',
    key: 'startTime',
    render: (text, record) => {
      return record.startTime ? Moment(new Date(record.startTime)).format('YYYY-MM-DD HH:mm:ss') : record.startTime;
    },
  },
  {
    title: '结束时间',
    // dataIndex: 'endTime',
    key: 'endTime',
    render: (text, record) => {
      return record.endTime ? Moment(new Date(record.endTime)).format('YYYY-MM-DD HH:mm:ss') : record.endTime;
    },
  },
  {
    title: '名单数',
    dataIndex: 'rosterNum',
    key: 'rosterNum',
  },
  {
    title: '外呼次数',
    dataIndex: 'outcallNum',
    key: 'outcallNum',
  },
  {
    title: '完成率',
    key: 'completeRate',
    render: (text, record) => {
      /** @namespace record.completeRate */
      return `${record.completeRate * 100}%`;
    },
  },
  {
    title: '应答率',
    key: 'answerRate',
    render: (text, record) => {
      /** @namespace record.answerRate */
      return `${record.answerRate * 100}%`;
    },
  },
  {
    title: '有效应答数',
    dataIndex: 'effectAnswerNum',
    key: 'effectAnswerNum',
  },
];

export const CallSummaryColumn = [
  {
    title: '日期',
    dataIndex: 'timeFlag',
    key: 'timeFlag',
  },
  {
    title: '完成任务数',
    dataIndex: 'completeTaskNum',
    key: 'completeTaskNum',
  },
  {
    title: '外呼次数',
    dataIndex: 'outcallNum',
    key: 'outcallNum',
  },
  {
    title: '外呼成功次数',
    dataIndex: 'outcallSuccessNum',
    key: 'outcallSuccessNum',
  },
  {
    title: '应答次数',
    dataIndex: 'outcallAnswerNum',
    key: 'outcallAnswerNum',
  },
  {
    title: '总通话时长',
    dataIndex: 'totalOutcallTime',
    key: 'totalOutcallTime',
  },
  {
    title: '平均通话时长',
    dataIndex: 'avgOutcallTime',
    key: 'avgOutcallTime',
  },
];

export const ProjectSummaryColumn = [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  // {
  //   title: '项目状态',
  //   key: 'status',
  //   render: (text, record) => {
  //     switch (record.taskStatus) {
  //       case 0:
  //         return '未开始';
  //       case 1:
  //         return '进行中';
  //       case 2:
  //         return '已完成';
  //       default:
  //         return '未知';
  //     }
  //   },
  // },
  // {
  //   title: '开始时间',
  //   // dataIndex: 'startTime',
  //   key: 'startTime',
  //   render: (text, record) => {
  //     return record.startTime ? Moment(new Date(record.startTime)).format('YYYY-MM-DD HH:mm:ss') : record.startTime;
  //   },
  // },
  // {
  //   title: '结束时间',
  //   // dataIndex: 'endTime',
  //   key: 'endTime',
  //   render: (text, record) => {
  //     return record.endTime ? Moment(new Date(record.endTime)).format('YYYY-MM-DD HH:mm:ss') : record.endTime;
  //   },
  // },
  {
    title: '名单数',
    dataIndex: 'rosterSum',
    key: 'rosterSum',
  },
  {
    title: '外呼人数',
    dataIndex: 'makeCallCustomerSum',
    key: 'makeCallCustomerSum',
  },
  {
    title: '累计外呼数',
    dataIndex: 'makeCallSum',
    key: 'makeCallSum',
  },
  {
    title: '接听人数',
    dataIndex: 'answerCallSum',
    key: 'answerCallSum',
  },
  {
    title: '停机数',
    key: 'stopPhone',
    render: (text, record) => {
      return `${record.stopSum}`;
    },
  },
  {
    title: '关机数',
    dataIndex: 'shutDownSum',
    key: 'shutDownSum',
  },
  {
    title: '空号数',
    dataIndex: 'deadNumSum',
    key: 'deadNumSum',
  },
];

// droped
export const ProjectDailySummaryColumn = () => {
  return [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = row.rowSpanDialInfo;
        return obj;
      },
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = row.rowSpanProject;
        return obj;
      },
    },
    {
      title: '名单数',
      dataIndex: 'rosterNum',
      key: 'rosterNum',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        obj.props.rowSpan = row.rowSpanDialInfo;
        return obj;
      },
    },
    {
      title: '拨打数',
      dataIndex: 'dialedRoster',
      key: 'dialedRoster',
    },
    {
      title: '接听数',
      dataIndex: 'answeredNum',
      key: 'answeredNum',
    },
    {
      title: '停机数',
      key: 'stopPhone',
      render: (text, record) => {
      /** @namespace record.answerRate */
        return `${record.stopPhone}`;
      },
    },
    {
      title: '空号数',
      dataIndex: 'blankNum',
      key: 'blankNum',
    },
  ];
};

export const ProjectDailySummaryColumnNew = (exportExcel) => {
  return [
    {
      title: '日期',
      dataIndex: 'recordTime',
      key: 'recordTime',
      render: (text, record) => {
        return record.recordTime ? Moment(new Date(record.recordTime)).format('YYYY-MM-DD') : record.recordTime;
      },
    },
    {
      title: '名单数',
      dataIndex: 'rosterSum',
      key: 'rosterSum',
    },
    {
      title: '拨打数',
      dataIndex: 'makeCallSum',
      key: 'makeCallSum',
    },
    {
      title: '接听数',
      dataIndex: 'answerCallSum',
      key: 'answerCallSum',
    },
    {
      title: '关机数',
      dataIndex: 'shutDownSum',
      key: 'shutDownSum',
    },
    {
      title: '停机数',
      key: 'stopSum',
      render: (text, record) => {
        /** @namespace record.answerRate */
        return `${record.stopSum}`;
      },
    },
    {
      title: ({ sortOrder, filters }) => {
        return (
          <div>
            <Row>
              <Col span={6} >
            空号数
              </Col>
              <Col span={4} >
                <Button type='dashed' icon='download' onClick={exportExcel} >导出记录</Button>
              </Col>
            </Row>
          </div>
        );
      },
      dataIndex: 'deadNumSum',
      key: 'deadNumSum',
    },
  ];
};
