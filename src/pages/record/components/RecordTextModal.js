import React, { Component } from 'react';
import { createTable } from '@/components/Tables';
import { connect } from 'dva';
import recordTextColumn from './RecordTextColumn';
import ModalBar from '@/components/ModalBar';

@connect(({ recordActions, loading }) => ({
  loadingTest: loading.effects['recordActions/getRecordText'],
  recordTextList: recordActions.recordTextList,
}))
class RecordTextModal extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      visible: false,
      title: '对话文本记录',
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      intentName: this.props.intentName,
    });
    if (this.props.callId && this.props.callId !== '') {
      const { dispatch } = this.props;
      dispatch({
        type: 'recordActions/getRecordText',
        data: {
          callId: this.props.callId,
        },
      });
    }
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { intentName, title, visible } = this.state;
    const { loadingTest, recordTextList } = this.props;
    const RecordTextTable = createTable(recordTextColumn, recordTextList, 'id', loadingTest, 'middle');
    const finalIntentName = `最终意图:${intentName}`;
    return (
      <span>
        <a href='javascript: void(0);' type='primary' onClick={this.showModal}>
          文本记录
        </a>
        <ModalBar
          width='80%'
          loading={visible}
          title={title}
          backText='确认'
          text={RecordTextTable}
          handleOk={this.handleOk}
          extText={finalIntentName}
        />
      </span>
    );
  }
}

export default RecordTextModal;
