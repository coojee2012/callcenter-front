import React, { Component } from 'react';
import { Button, Input, message, DatePicker, Cascader } from 'antd';
import qs from 'qs';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { BASE_URL } from '@/utils/constant';
import styles from './RecordSearchBar.less';

const { RangePicker } = DatePicker;
// 搜索组件
class RecordSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      rangeDate: [moment().startOf('month'), moment()],
      likeKeyWord: '',
      // businessCode: '',
      dateString: [moment().startOf('month').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
    });
  }

  componentDidMount() {
    this.filterRecord();
  }

  // 关键字筛选
  handleKeyWordChange = (e) => {
    this.setState({
      likeKeyWord: e.target.value,
    });
  };

  handlePickerChange = (date) => {
    let startTime = '';
    let endTime = '';
    startTime = date[0].format('YYYY-MM-DD 00:00:00');
    endTime = date[1].format('YYYY-MM-DD 23:59:59');
    this.setState({ rangeDate: date, dateString: [startTime, endTime] });
  };

  // 筛选角色列表
  filterRecord = () => {
    const { onSearch } = this.props;
    const { dateString, likeKeyWord } = this.state;
    const [startTime, endTime] = dateString;
    onSearch({
      likeKeyWord,
      startTime,
      endTime,
    });
  };

  // 重置
  resetFilter = () => {
    const { onSearch } = this.props;
    const startTime = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
    const endTime = moment().format('YYYY-MM-DD 23:59:59');
    this.setState({
      rangeDate: [moment().startOf('month'), moment()],
      likeKeyWord: '',
      dateString: [startTime, endTime],
    });
    onSearch({
      likeKeyWord: '',
      startTime,
      endTime,
    });
  };

  // 点击导出
  bindExport = () => {
    const { dateString, likeKeyWord } = this.state;
    const [startTime, endTime] = dateString;
    const qstr = qs.stringify({ likeKeyWord, startTime: startTime.replace(/-/g, '/'), endTime: endTime.replace(/-/g, '/') }, { encode: true });
    const url = `${BASE_URL}report/excel/recordList?${qstr}&extCol=`;
    window.open(url, '_blank');
  };

  // 导出录音
  exportVoices = () => {
    const { onExportVoices, selectedRowKeys } = this.props;
    if (selectedRowKeys.length > 0) {
      onExportVoices(selectedRowKeys);
    } else {
      message.error('请选择记录！');
    }
  };

  // onCascaderChange = (value) => {
  //   this.setState({
  //     businessCode: value[0],
  //   });
  // }

  render() {
    const { rangeDate, likeKeyWord } = this.state;
    return (
      <div className={styles.main}>
        <RangePicker
          allowClear={false}
          value={rangeDate}
          onChange={this.handlePickerChange}
          className={styles.btn}
        />
        {/* <Cascader
          allowClear={false}
          options={typeList}
          value={[businessCode]}
          fieldNames={{ label: 'typeName', value: 'businessCode', children: 'items' }}
          onChange={this.onCascaderChange}
          placeholder='请选择业务类型'
        /> */}
        <Input placeholder='关键字：项目名称、任务名称、手机号' value={likeKeyWord} onChange={this.handleKeyWordChange}/>
        <Button className={styles.btn} type='primary' onClick={this.filterRecord}>查询</Button>
        <Button className={styles.btn} onClick={this.resetFilter}>重置</Button>
        <Button className={styles.btn} onClick={this.bindExport}>导出excel</Button>
        <Button onClick={this.exportVoices}>导出录音</Button>
      </div>
    );
  }
}

export default RecordSearchBar;
