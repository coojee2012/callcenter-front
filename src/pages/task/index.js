import React, { Component } from 'react';
import { connect } from 'dva';

import TaskCountBar from './components/TaskCountBar';
import TaskFilterBar from './components/TaskFilterBar';
import TaskListBar from './components/TaskListBar';
import styles from './index.less';
// 任务管理默认界面
@connect(({ loading, taskActions }) => ({
  getTaskListLoading: loading.effects['taskActions/getTaskList'],
  taskList: taskActions.taskList,
  totalCount: taskActions.totalCount,
  totalCompleted: taskActions.totalCompleted,
}))
class TaskList extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = ({
      current: 1,
      auditStatus: -1,
      taskNameLike: '',
    });
    dispatch({
      type: 'taskActions/getTaskList',
      data: { page: 1, auditStatus: -1, taskNameLike: '' },
    });
  }

  onSearch(data) {
    const { auditStatus, taskNameLike } = this.state;
    this.setState(Object.assign({}, { current: 1 }, data));
    const { dispatch } = this.props;
    dispatch({
      type: 'taskActions/getTaskList',
      data: Object.assign({}, { page: 1, auditStatus, taskNameLike }, data),
    });
  }

  onPageChange(page, pageSize) {
    const { auditStatus, taskNameLike } = this.state;
    this.setState({ current: page });
    const { dispatch } = this.props;
    dispatch({
      type: 'taskActions/getTaskList',
      data: { page, auditStatus, taskNameLike },
    });
  }

  render() {
    const {
      getTaskListLoading, taskList, totalCount, totalCompleted,
    } = this.props;
    const { current } = this.state;
    return (
      <div className={styles.content}>
        <div className={styles.head}>
          <TaskCountBar totalCount={totalCount} totalCompleted={totalCompleted}/>
        </div>
        <div className={styles.form}>
          <TaskFilterBar onSearch={(data) => { this.onSearch(data); }}/>
          <TaskListBar current={current} loading={getTaskListLoading} onPageChange={(page, pageSize) => { this.onPageChange(page, pageSize); }} taskList={taskList} total={totalCount}/>
        </div>
      </div>
    );
  }
}

export default TaskList;
