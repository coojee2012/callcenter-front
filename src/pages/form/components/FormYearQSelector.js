import React, { Component } from 'react';
import { Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';


moment.locale('zh-cn');
const { Option } = Select;
const YearOptions = (() => {
  const thisYear = moment().year();
  const options = [];
  for (let i = -10; i < 10; i++) {
    const thatYear = thisYear + i;
    options.push({
      lable: `${thatYear}年`,
      value: thatYear,
    });
  }
  return options;
})();

const QuarterOptions = (() => {
  const thisYear = moment().year();
  const options = [];
  for (let i = -10; i < 10; i++) {
    const thatYear = thisYear + i;
    for (let j = 1; j < 5; j++) {
      options.push({
        lable: `${thatYear}年${j}季度`,
        value: `${thatYear}-${j}`,
      });
    }
  }
  return options;
})();

class FormYearQSelector extends Component {
  constructor(props) {
    super(props);
    const { mode } = props;
    this.state = ({
      selectType: mode,
      selectValue: mode === 'year' ? moment().year() : `${moment().year()}-${moment().quarter()}`,
    });
    this.handleChange.bind(this);
  }


  handleChange(value) {
    console.log(`selected ${value}`);
    const { mode, onChange } = this.props;
    this.setState({ selectValue: value });
    if (mode === 'year') {
      onChange(moment([value]), '');
    } else {
      const [year, quarter] = value.split('-');
      onChange(moment(year).quarter(quarter), '');
    }
  }

  render() {
    const { selectType, selectValue } = this.state;
    const options = selectType === 'year' ? YearOptions : QuarterOptions;
    return (
      <>
        <Select defaultValue={selectValue} style={{ width: 160 }} onChange={(value) => { this.handleChange(value); }}>
          {options.map((item) => {
            return (<Option value={item.value} key={item.value}>{item.lable}</Option>);
          })}
        </Select>
      </>
    );
  }
}
export default FormYearQSelector;
