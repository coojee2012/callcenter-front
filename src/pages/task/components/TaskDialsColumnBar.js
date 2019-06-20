import React from 'react';
import { Divider, Tooltip } from 'antd';
import Moment from 'moment';

import RecordTextModal from '../../record/components/RecordTextModal';

export default (props) => {
  const playRecord = (key, id) => {
    const audios = document.getElementsByTagName('audio');
    for (let i = 0; i < audios.length; i++) {
      audios[i].pause();
    }
    const audio = document.getElementById(id);
    switch (key) {
      case 'play':
        audio.play();
        break;
      case 'pause':
        audio.pause();
        break;
      default:
        break;
    }
  };
  return [
    {
      title: '客户ID',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (text, record) => {
        const subStr = text.substring(0, 6);
        return (
          <Tooltip placement='topLeft' title={text} arrowPointAtCenter>
            {subStr}...
          </Tooltip>
        );
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
    },
    {
      title: '拨打时间',
      dataIndex: 'makeCallTime',
      key: 'makeCallTime',
    },
    {
      title: '应答时间',
      dataIndex: 'callAnswerTime',
      key: 'callAnswerTime',
    },
    {
      title: '结束时间',
      dataIndex: 'callEndTime',
      key: 'callEndTime',
    },
    {
      title: '呼叫结果',
      dataIndex: 'callResult',
      key: 'callResult',
    },
    {
      title: '响铃时长(s)',
      dataIndex: 'ringTime',
      key: 'ringTime',
      // render: (text, record) => {
      //   const bTime = record.callAnswerTime === '' ? record.callEndTime : record.callAnswerTime;
      //   if (bTime !== '' && record.makeCallTime !== '') {
      //     const makeTime = Moment(bTime);
      //     const answerTime = Moment(record.makeCallTime);
      //     return makeTime.diff(answerTime, 'seconds');
      //   } else {
      //     return '';
      //   }
      // },
    },
    {
      title: '通话时长(s)',
      dataIndex: 'answerCallTime_str',
      key: 'answerCallTime_str',
      render: (text, record) => {
        const { callTime, ringTime } = record;
        return callTime - ringTime;
      },
    },
    {
      title: '拨打时长(s)',
      dataIndex: 'callTime',
      key: 'callTime',
    },
    {
      title: '客户意图',
      dataIndex: 'intentName',
      key: 'intentName',
    },
    {
      title: '呼叫编号',
      dataIndex: 'callId',
      key: 'callId',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
      /** @namespace record.callId */
      /** @namespace record.recordFile */
        return (
          <span>
            <a href={`${record.recordFile}`}>下载</a>
            <Divider type='vertical'/>
            <audio
              id={record.callId}
              src={record.recordFile}
              controls={false}
              preload='none'
              controlsList='nodownload'
            >
              <track kind='captions'/>
              您的浏览器不支持 audio 元素。
            </audio>
            <a href='javascript: void(0);' onClick={() => playRecord('play', record.callId)}>播放</a>
            <Divider type='vertical'/>
            <a href='javascript: void(0);' onClick={() => playRecord('pause', record.callId)}>暂停</a>
            <Divider type='vertical'/>
            <RecordTextModal callId={record.callId} intentName={record.intentName} {...props} />
            {/*<MoreBtn {...props} current={record.callId}/>*/}
          </span>
        );
      },
    },
  ];
};
