import React, { Component } from 'react';
import {
  Button, Row, Col, Progress, List, Spin,
} from 'antd';
import router from 'umi/router';

import { getDateTime, StatusType } from '@/utils/common';
import { BUSSINESS_CODE, PAGE_SIZE } from '@/utils/constant';
import styles from './TaskListBar.less';


// 审核进度条组件
const ProgressItem = (data) => {
  const item = StatusType(data);

  return (
    <div className={styles.progress}>
      <Progress
        className={styles.length}
        showInfo={false}
        percent={item.percent}
        size='small'
        status={item.status}
      />
      <span className={styles.text}>{item.text}</span>
    </div>
  );
};

// 更多
// const MoreBtn = props => (
//   <Dropdown
//     overlay={(
//       <Menu
//         onClick={() => {
//           const { dispatch } = props;
//           dispatch({
//             type: 'taskActions',
//           });
//         }}
//       >
//         <Menu.Item key="delete">删除</Menu.Item>
//       </Menu>
//     )}
//   >
//     <a>
//       更多 <Icon type="down"/>
//     </a>
//   </Dropdown>
// );

// 图标
export const taskIcon = (type) => {
  let color = '';
  let text = '';
  switch (type) {
    case BUSSINESS_CODE.CS_STAN:
      color = '#597EF7';
      text = '催收';
      break;
    case BUSSINESS_CODE.YX_STAN:
      color = '#36CFC9';
      text = '营销';
      break;
    default:
      color = '#4af721';
      text = '其他';
      break;
  }
  return (
    <Col span={2} className={styles.icon} style={{ backgroundColor: color }}>
      <span>{text}</span>
    </Col>
  );
};

// 单个列表组件
export const TaskListItem = (props) => {
  const { item, showCode } = props;
  return (
    <Row className={styles.item}>
      { showCode && taskIcon(item.businessCode)}
      <Col span={6} className={styles.desc}>
        <p className={styles.title}>
          {item.taskName}
        </p>
        <p className={styles.des}>编号：{item.taskNo}</p>
      </Col>
      <Col span={2} className={styles.common}>
        <p className={styles.first}>发起人</p>
        <p className={styles.second}>{item.createOper}</p>
      </Col>
      <Col span={4} className={styles.common}>
        <p className={styles.first}>创建时间</p>
        <p className={styles.second}>{getDateTime(item.createTime)}</p>
      </Col>
      <Col span={2} className={styles.common}>
        <p className={styles.first}>有效人数</p>
        <p className={styles.second}>{item.validCount}</p>
      </Col>
      <Col span={7} className={styles.common}>
        {item.auditStatus < 3 ? (
          <span>
            <p className={styles.first}>审核进度</p>
            <ProgressItem status={item.auditStatus} type='audit'/>
          </span>
        ) : (
          <span>
            <p className={styles.first}>任务进度</p>
            <ProgressItem status={item.taskStatus} type='task'/>
          </span>
        )
        }
      </Col>
      <Col span={1} className={styles.action}>
        <a href={`/task/${item.taskId}`}>查看</a>
      </Col>
    </Row>
  );
};

// 任务列表列表组件
class TaskListBar extends Component {
  // 跳转新增页面
  addNewTask = () => {
    router.push('/task/add');
  };


  render() {
    const page_size = PAGE_SIZE;
    const {
      loading, taskList, total, onPageChange, current,
    } = this.props;
    // const { contentHeight } = this.state;
    const showCode = true;

    return (
      <div className={styles.main}>
        <Button className={styles.add_btn} type='dashed' block onClick={this.addNewTask}>+ 添加</Button>
        <Spin
          tip='正在加载...'
          spinning={loading}
        >
          <List
            itemLayout='vertical'
            pagination={{
              pageSize: page_size,
              total,
              current,
              onChange: (page, pageSize) => { onPageChange(page, pageSize); },
            }}
            dataSource={taskList}
            renderItem={item => (
              <TaskListItem {...this.props} item={item} showCode={showCode}/>
            )}
          />
        </Spin>
      </div>
    );
  }
}

export default TaskListBar;
