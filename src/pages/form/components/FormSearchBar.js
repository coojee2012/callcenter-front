import React, { Component } from 'react';
import {
  Button, Radio, DatePicker, Input,
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './FormSearchBar.less';
import FormYearQSelector from './FormYearQSelector';

moment.locale('zh-cn');
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { Search } = Input;

// 搜索组件
class FormSearchBar extends Component {
  constructor(props) {
    super(props);
    const { SearchBarProps } = props;
    this.state = ({
      formType: SearchBarProps.type,
      rangeDate: [moment().startOf('month'), moment()],
      date: moment(),
      dateType: 0, // 日期类型0.日 1.周 2.月 3.季 4.年
      dateString: [moment().startOf('month').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
      filterValue: SearchBarProps.radio.status ? SearchBarProps.radio.list[1].value : 'month',
      searchValue: '',
    });
  }

  handleRadioChange = (e) => {
    const filterValue = e.target.value;
    const { formType } = this.state;
    const date = ['task', 'project', 'projectDaily'].indexOf(formType) > -1 ? [moment().startOf('month'), moment()] : moment();
    this.setState({ filterValue: e.target.value });
    this.doneSearchChange(filterValue, date);
  };

  handlePickerChange = (date, dateString) => {
    const { filterValue } = this.state;
    this.doneSearchChange(filterValue, date);
  };

  doneSearchChange = (filterValue, date) => {
    const { formType } = this.state;
    let startTime = '';
    let endTime = '';
    let dateType = 0;
    if (['task', 'project', 'projectDaily', 'projectIntention'].indexOf(formType) > -1) {
      startTime = date[0].format('YYYY-MM-DD 00:00:00');
      endTime = date[1].format('YYYY-MM-DD 23:59:59');
      this.setState({ rangeDate: date, dateString: [startTime, endTime], dateType });
    } else if (['call', 'other'].indexOf(formType) > -1) {
      switch (filterValue) {
        case 'month':
          startTime = date.startOf('month').format('YYYY-MM-DD 00:00:00');
          endTime = date.endOf('month').format('YYYY-MM-DD 23:59:59');
          break;
        case 'week':
          dateType = 0;
          startTime = date.startOf('week').format('YYYY-MM-DD 00:00:00');
          endTime = date.endOf('week').format('YYYY-MM-DD 23:59:59');
          break;
        case 'quarter':
          dateType = 2;
          startTime = date.startOf('quarter').format('YYYY-MM-DD 00:00:00');
          endTime = date.endOf('quarter').format('YYYY-MM-DD 23:59:59');
          break;
        case 'year':
          dateType = 2;
          startTime = date.startOf('year').format('YYYY-MM-DD 00:00:00');
          endTime = date.endOf('year').format('YYYY-MM-DD 23:59:59');
          break;
        default:
          startTime = date.startOf('month').format('YYYY-MM-DD 00:00:00');
          endTime = date.endOf('month').format('YYYY-MM-DD 23:59:59');
          break;
      }
      this.setState({ date, dateString: [startTime, endTime], dateType });
    }
  }

  // 查询
  handleSearch = () => {
    const { onSearch, formId } = this.props;
    const { dateString, dateType, formType, searchValue } = this.state;
    const [startTime, endTime] = dateString;
    onSearch({
      startTime, endTime, dateType, formType, searchValue,
    }, formId);
  };

  handleInputChange = (e) => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  // 重置
  resetFilter = () => {
    const { onSearch, formId, SearchBarProps } = this.props;
    const startTime = moment().startOf('month').format('YYYY-MM-DD 00:00:00');
    const endTime = moment().format('YYYY-MM-DD 23:59:59');
    this.setState({
      formType: SearchBarProps.type,
      searchValue: '',
      rangeDate: [moment().startOf('month'), moment()],
      date: moment(),
      dateType: 0, // 日期类型0.日 1.周 2.月 3.季 4.年
      dateString: [startTime, endTime],
      filterValue: SearchBarProps.radio.status ? SearchBarProps.radio.list[1].value : 'month',
    });
    onSearch({
      startTime, endTime, dateType: 0, formType: SearchBarProps.type, searchValue: '',
    }, formId);
  };

  // 点击导出
  bindExport = () => {
    // const { data, formName, column } = this.props;
    // const newColumns = [];
    // column.forEach((item) => {
    //   newColumns.push(item.title);
    // });
    // exportExcel(data, newColumns, formName);
    const { export2Excel, formId } = this.props;
    const { dateString, dateType, formType, searchValue } = this.state;
    const [startTime, endTime] = dateString;
    export2Excel({
      startTime, endTime, dateType, formType, searchValue,
    }, formId);
  };

  render() {
    const {
      filterValue, date, searchValue, formType, rangeDate,
    } = this.state;
    const { SearchBarProps } = this.props;

    return (
      <div className={styles.main}>
        { ['task', 'project', 'projectDaily', 'projectIntention'].indexOf(formType) > -1 && (
          <RangePicker
            allowClear={false}
            value={rangeDate}
            onChange={this.handlePickerChange}
            className={styles.btn}
          />
        )}
        { ['call', 'other'].indexOf(formType) > -1 && filterValue === 'month' && (
          <MonthPicker
            allowClear={false}
            value={date}
            onChange={this.handlePickerChange}
            className={styles.btn}
          />
        )}
        { ['call', 'other'].indexOf(formType) > -1 && filterValue === 'week' && (
          <WeekPicker
            allowClear={false}
            value={date}
            onChange={this.handlePickerChange}
            className={styles.btn}
          />
        )}
        { ['call', 'other'].indexOf(formType) > -1 && filterValue === 'quarter' && (
          <FormYearQSelector
            mode='quarter'
            onChange={this.handlePickerChange}
          />
        )}
        { ['call', 'other'].indexOf(formType) > -1 && filterValue === 'year' && (
          <FormYearQSelector
            mode='year'
            onChange={this.handlePickerChange}
          />
        )}


        {SearchBarProps.search.status && (
          <Search
            className={styles.search}
            placeholder={`请输入关键字：${SearchBarProps.search.label}`}
            onChange={this.handleInputChange}
            value={searchValue}
            onSearch={this.handleSearch}
          />
        )}
        {SearchBarProps.radio.status && (
          <Radio.Group
            value={filterValue}
            onChange={this.handleRadioChange}
            className={styles.btn}
          >
            {SearchBarProps.radio.list.map((item, index) => (
              <Radio.Button key={index} value={item.value}>{item.text}</Radio.Button>
            ))}
          </Radio.Group>
        )}
        <Button className={styles.btn} type='primary' onClick={this.handleSearch}>查询</Button>
        <Button className={styles.btn} onClick={this.resetFilter}>重置</Button>
        <Button className={styles.btn} onClick={this.bindExport}>导出Excel</Button>
      </div>
    );
  }
}

export default FormSearchBar;
