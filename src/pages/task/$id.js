import _ from 'lodash';
import React, { Component } from 'react';
import {
  Button, Tabs, Spin, Form, Modal,
  Row, Col, Checkbox,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import { createStepBar } from '@/components/StepBar';
import { createTable } from '@/components/Tables';
import { getDateTime, dynamicNameTableData, StatusType } from '@/utils/common';
import ModalBar from '@/components/ModalBar';
import TextArea from 'antd/lib/input/TextArea';
import { isArray } from 'util';
import columns from './components/TaskInfoColumnBar';
import dialColumns from './components/TaskDialsColumnBar';
import styles from './$id.less';

import { FORM_ITEM_LAYOUT, PAGE_SIZE, BASE_URL } from '@/utils/constant';
// 模拟数据

const CheckboxGroup = Checkbox.Group;

const progress = [
  {
    title: '待审核',
    description: '',
  },
  {
    title: '初审',
    description: '',
  },
  {
    title: '复审',
    description: '',
  },
  {
    title: '完成',
    description: '',
  },
];


const { TabPane } = Tabs;

// 任务详情页面
@connect(({ taskActions, loading }) => ({
  taskInfo: taskActions.taskInfo,
  taskDetail: taskActions.taskDetail,
  taskDials: taskActions.taskDials,
  processInfo: taskActions.processInfo,
  templateColums: taskActions.templateColums,
  showModal: taskActions.showModal,
  loadTaskInfo: loading.effects['taskActions/getTaskInfo'],
}))
@Form.create()
class TaskInfo extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      currentNames: 1,
      currentDials: 1,
      nameFieldCheckedList: [],
      showRejectModal: false,
    });
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'taskActions/getTaskInfo',
      data: match.params.id,
    });
  }

  componentDidUpdate() {


  }

  // 审核
  auditTask = (currentProcess, opType, remark = '') => {
    if (!currentProcess) {
      console.error('审核流程无效');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'taskActions/auditTask',
      data: {
        opType,
        processId: currentProcess.processId,
        remark,
      },
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskActions/closeModel',
    });
    this.toBack();
  };

  passDisabled = () => {
    const { showRejectModal } = this.state;
    this.setState({ showRejectModal: !showRejectModal });
  };

doReject= (e, currentProcess, opType) => {
  e.preventDefault();
  this.props.form.validateFields((err, values) => {
    if (!err) {
      this.auditTask(currentProcess, opType, values.remark);
      this.setState({ showRejectModal: false });
    } else {
      console.log('输入有误');
      this.setState({ showRejectModal: false });
    }
  });
};

  // 返回事件
  toBack = () => {
    // router.goBack();
    router.push('/task');
  };

  onPageChange = (page) => {
    this.setState({ currentNames: page });
    const { dispatch, match } = this.props;
    dispatch({
      type: 'taskActions/getTaskNames',
      data: {
        pageNum: page,
        taskId: match.params.id,
      },
    });
  }

  onDialPageChange = (page) => {
    this.setState({ currentDials: page });
    const { dispatch, match } = this.props;
    dispatch({
      type: 'taskActions/getTaskDials',
      data: {
        pageNum: page,
        taskId: match.params.id,
      },
    });
  }

  // 点击导出
  bindExportDialExcel = () => {
    const { match } = this.props;
    const { id } = match.params;
    const selectColumns = this.getNameShowFileds();
    let qstr = `taskId=${id}`;
    selectColumns.forEach((item) => {
      qstr += `&extCol=${item.dataIndex}`;
    });
    if (selectColumns.length < 1) {
      qstr += '&extCol=';
    }
    const url = `${BASE_URL}report/excel/recordList?${qstr}`;
    window.open(url, '_blank');
  };

  getNameCheckOPtions = () => {
    const { templateColums } = this.props;
    const nameLabeOptions = [];
    for (let i = 0; i < templateColums.length; i++) {
      if (templateColums[i].columnCode === 'phone') {
        continue;
      } else {
        nameLabeOptions.push(templateColums[i].name);
      }
    }
    return nameLabeOptions;
  }

  getNameShowFileds = () => {
    const { templateColums } = this.props;
    const showFileds = [];
    const { nameFieldCheckedList } = this.state;
    // TODO 此处可以思考更优的算法，字段不会太多怎么简单怎么来
    for (let i = 0; i < nameFieldCheckedList.length; i++) {
      for (let j = 0; j < templateColums.length; j++) {
        if (templateColums[j].name === nameFieldCheckedList[i]) {
          showFileds.push({
            title: templateColums[j].name,
            dataIndex: templateColums[j].columnCode,
            key: templateColums[j].columnCode,
          });
        }
      }
    }
    return showFileds;
  }

  getDailData = ({ nameShowColums, nameCustormIds, nameDatas, dialTableData }) => {
    const data = [];
    const pickNames = [];
    nameShowColums.forEach((o) => {
      pickNames.push(o.dataIndex);
    });
    if (isArray(dialTableData) && dialTableData.length) {
      for (let i = 0; i < dialTableData.length; i++) {
        const item = dialTableData[i];
        const { extRosterInfo } = item;
        const pickedName = _.pick(extRosterInfo, pickNames);
        data.push(Object.assign({}, item, pickedName));
      }
    }
    return data;
  }

  onNameFieldChange = (checkedList) => {
    this.setState({
      nameFieldCheckedList: checkedList,
    });
  };

  render() {
    const {
      loadTaskInfo, taskInfo, processInfo, taskDetail, showModal, taskDials,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { showRejectModal, currentNames, currentDials, nameFieldCheckedList } = this.state;
    // const taskId = this.props.match.params.id;
    const data = taskDetail || {};
    const nameListData = taskInfo;
    const dialTableData = taskDials ? taskDials.list : [];
    const dialsTotal = taskDials ? taskDials.totalCount : 0;
    let current = 0;
    let currentProcess = null;
    const process = processInfo || [];
    process.sort(() => {
      return (a, b) => {
        const value1 = a.step;
        const value2 = b.step;
        return value1 - value2;
      };
    });
    if (process.length > 0 && process[0].status === 1) {
      current = 1;
      [currentProcess] = process;
    } else if (process.length > 1 && process[0].status === 2 && process[1].status === 1) {
      current = 2;
      [, currentProcess] = process;
    } else if (process.length > 1 && process[0].status === 2 && process[1].status === 2) {
      current = 3;
    }

    const { nameColumns, nameDatas, totalNames, nameCustormIds } = dynamicNameTableData(nameListData);

    const namesPagination = {
      pageSize: PAGE_SIZE,
      total: totalNames,
      current: currentNames,
      onChange: (page, pageSize) => { this.onPageChange(page, pageSize); },
    };

    const dialsPagination = {
      pageSize: PAGE_SIZE,
      total: dialsTotal,
      current: currentDials,
      onChange: (page, pageSize) => { this.onDialPageChange(page, pageSize); },
    };


    const nameListTable = createTable(nameColumns, nameDatas, 'customerId', loadTaskInfo, 'middle', null, namesPagination, { padding: '0 24px' });
    const StepBar = createStepBar(Object.assign({}, data, { progress, current }), 'task');

    const nameLabeOptions = this.getNameCheckOPtions(nameColumns);
    const nameShowColums = this.getNameShowFileds(nameColumns);
    const dynamicDialData = this.getDailData({ nameShowColums, nameCustormIds, nameDatas, dialTableData });
    const dialcolumns = nameShowColums.concat(dialColumns(this.props));

    const DialsTable = createTable(dialcolumns, dynamicDialData, 'callId', loadTaskInfo, 'middle', null, dialsPagination, { padding: '0 24px' });
    const statusItem = data.auditStatus < 3 ? StatusType({
      type: 'audit',
      status: data.auditStatus,
    }) : StatusType({ type: 'task', status: data.taskStatus });
    return (
      <div className={styles.main}>
        <Spin
          tip='正在加载...'
          spinning={loadTaskInfo}
        >
          <div className={styles.head}>
            <div>
              <div className={styles.task_first}>
                <span>任务名称：</span><span>{data.taskName}</span>
                <div className={styles.first_btn}>
                  <Button onClick={this.toBack}>返 回</Button>
                  {currentProcess && currentProcess.opPermission && data.auditStatus > -1 && data.auditStatus < 3 ? (
                    <span>
                      <Button type='primary' className={styles.no} onClick={() => this.passDisabled()}>驳 回</Button>
                      <Button type='primary' onClick={() => this.auditTask(currentProcess, 1)}>通 过</Button>
                    </span>
                  ) : null}
                </div>
              </div>
              <div className={styles.task_second}>
                <div>
                  <p>
                    <span>创建人：</span><span>{data.createOper}</span>
                  </p>
                  <p>
                    <span>业务类型：</span><span>{data.businessName}</span>
                  </p>
                  <p>
                    <span>创建时间：</span><span>{getDateTime(data.createTime)}</span>
                  </p>
                </div>
                <div>
                  <p>状态</p>
                  <p>{statusItem.text}</p>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey='1'
            tabBarStyle={{ background: '#FFFFFF', padding: '0 24px' }}
          >
            <TabPane tab='审核进度' key='1'>
              <div style={{ padding: '0 24px' }}>
                {StepBar}
              </div>
            </TabPane>
            <TabPane tab='名单列表' key='2'>{nameListTable}</TabPane>
            <TabPane tab='拨打记录' key='3'>
              <div style={{ marginBottom: '14px' }}>
                <Row>
                  <Col span={16} offset={1}>
                    <span>请选择所需名单列：</span>
                    <CheckboxGroup
                      options={nameLabeOptions}
                      value={nameFieldCheckedList}
                      onChange={this.onNameFieldChange}
                    />
                  </Col>
                  <Col span={4} offset={2}>
                    <Button type='primary' icon='copy' onClick={this.bindExportDialExcel} >导出</Button>
                  </Col>
                </Row>
              </div>
              {DialsTable}
            </TabPane>
          </Tabs>
        </Spin>
        <ModalBar loading={showModal} title='成功' backText='确认' text='任务审核成功！' handleOk={this.handleOk}/>
        <Modal
          title='驳回原因'
          visible={showRejectModal}
          onCancel={this.passDisabled}
          footer={[]}
        >
          <Form
            onSubmit={e => this.doReject(e, currentProcess, 0)}
            className={styles.form}
          >
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='驳回原因：'
            >
              {getFieldDecorator('remark', {
                rules: [{ required: true, message: '请输入原因!' }],
              })(
                <TextArea placeholder='请输入驳回得原因'/>,
              )}
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 24 }}
              className={styles.btn_group_2}
            >
              <Button type='primary' htmlType='submit' loading={false} style={{ marginRight: '50px' }}>
                  提 交
              </Button>
              <Button onClick={this.passDisabled}>返 回</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}


export default TaskInfo;
