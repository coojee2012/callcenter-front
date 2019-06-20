import React, { Component } from 'react';
import { Button, Input, Cascader, DatePicker } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './RosterSearchBar.less';

const { RangePicker } = DatePicker;
class RosterSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      rangeDate: [moment().startOf('month'), moment()],
      likeKeyWord: '',
      businessCode: '',
      dateString: [moment().startOf('month').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
    });
  }

  componentDidMount() {
    this.filterRecord();
  }

  handleKeyWordChange = (e) => {
    this.setState({
      likeKeyWord: e.target.value,
    });
  }

  filterRecord = () => {
    const { onSearch } = this.props;
    const { dateString, likeKeyWord, businessCode } = this.state;
    const [startTime, endTime] = dateString;
    onSearch({
      likeKeyWord,
      startTime,
      businessCode,
      endTime,
    });
  }

  resetFilter = () => {
    const { onSearch } = this.props;
    this.setState({
      rangeDate: [moment().startOf('month'), moment()],
      likeKeyWord: '',
      businessCode: '',
      dateString: [moment().startOf('month').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
    });
    onSearch({
      likeKeyWord: '',
      startTime: moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
      businessCode: '',
      endTime: moment().format('YYYY-MM-DD 23:59:59'),
    });
  }

  createNew = () => {
    router.push('/roster/add');
  }

  onCascaderChange = (value) => {
    this.setState({
      businessCode: value[0],
    });
  }

  handlePickerChange = (date) => {
    let startTime = '';
    let endTime = '';
    startTime = date[0].format('YYYY-MM-DD 00:00:00');
    endTime = date[1].format('YYYY-MM-DD 23:59:59');
    this.setState({ rangeDate: date, dateString: [startTime, endTime] });
  };

  //判断点击的键盘的keyCode是否为13，是就调用上面的搜索函数
handleEnterKey = (e) => {
  if (e.nativeEvent.keyCode === 13) { //e.nativeEvent获取原生的事件对像
    this.filterRecord();
  }
}

render() {
  const { rangeDate, likeKeyWord, businessCode } = this.state;
  const { typeList = [] } = this.props;

  return (
    <div className={styles.main}>
      <RangePicker
        allowClear={false}
        value={rangeDate}
        placeholder={['创建时间 起', '止']}
        onChange={this.handlePickerChange}
        className={styles.btn}
      />
      <Input placeholder='关键字：名单名称' onKeyPress={this.handleEnterKey} value={likeKeyWord} onChange={this.handleKeyWordChange}/>
      <Cascader
        allowClear={false}
        options={typeList}
        value={[businessCode]}
        fieldNames={{ label: 'typeName', value: 'businessCode', children: 'items' }}
        onChange={this.onCascaderChange}
        placeholder='请选择业务类型'
      />,
      <Button className={styles.btn} type='primary' onClick={this.filterRecord}>查询</Button>
      <Button className={styles.btn} onClick={this.resetFilter}>重置</Button>
      <Button className={styles.btn} type='dashed' icon='plus' onClick={(e) => { this.createNew(e); }}>新建名单</Button>
    </div>
  );
}
}
export default RosterSearchBar;
