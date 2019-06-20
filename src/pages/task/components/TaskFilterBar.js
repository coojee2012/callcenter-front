import React, { Component } from 'react';
import { Radio, Input } from 'antd';

import styles from './TaskFilterBar.less';

const { Search } = Input;

// 任务列表筛选组件
export default class TaskFilterBar extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      filterValue: 'all',
    });
  }

  handleRadioChange = (e) => {
    const radioValue = e.target.value;
    const { onSearch } = this.props;
    this.setState({
      filterValue: radioValue,
    });
    let auditStatus = -1;
    switch (radioValue) {
      case 'auditing':
        auditStatus = 2;
        break;
      case 'waiting':
        auditStatus = 0;
        break;
      default:
        auditStatus = -1;
        break;
    }
    onSearch({ auditStatus });
  };

  render() {
    const { filterValue } = this.state;
    const { onSearch } = this.props;

    return (
      <div className={styles.main}>
        <Radio.Group
          value={filterValue}
          onChange={this.handleRadioChange}
          className={styles.btn}
        >
          <Radio.Button value='all'>全部</Radio.Button>
          {/*<Radio.Button value="auditing">审核中</Radio.Button>*/}
          <Radio.Button value='waiting'>待审核</Radio.Button>
        </Radio.Group>
        <Search
          className={styles.search}
          placeholder='请输入关键字：任务名称'
          onSearch={(value) => {
            onSearch({ taskNameLike: value });
            // dispatch({
            //   type: 'taskActions/getTaskList',
            //   data: `taskNameLike=${value}`,
            // });
          }}
        />
      </div>
    );
  }
}
