import _ from 'lodash';
import qs from 'qs';
import React, { Component } from 'react';
import {
  Button, Tabs, Spin, Form, Modal, List, Cascader, DatePicker, message, Input, Col, Row,
  Checkbox, Tooltip,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { isArray } from 'util';
import { createBreadcrumbs } from '@/components/Breakcrumbs';
import { createTable } from '@/components/Tables';
import { getDateTime, getProjStatusName, dynamicNameTableData } from '@/utils/common';
import TextArea from 'antd/lib/input/TextArea';
import ProjBusinessPramas from '@/components/ProjBusinessPramas';
import dialColumns from '../task/components/TaskDialsColumnBar';
import styles from './$id.less';
import projTaskColumns from './components/ProjTaskColumns';

import { FORM_ITEM_LAYOUT, PAGE_SIZE, BASE_URL } from '@/utils/constant';


const { TabPane } = Tabs;

const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;


@connect(({ projActions, loading }) => ({
  projList: projActions.projList,
  projectInfo: projActions.projectInfo,
  taskTypeList: projActions.taskTypeList,
  isEdited: projActions.isEdited,
  nameList: projActions.nameList,
  templateColums: projActions.templateColums,
  taskList: projActions.taskList,
  businessPramas: projActions.businessPramas,
  businessSummary: projActions.businessSummary,
  projectCalls: projActions.projectCalls,
  loadingBusinessParam: loading.effects['projActions/getBusinessPramas'],
  loadingProjectInfo: loading.effects['projActions/loadProjectInfo'],
}))
@Form.create()
class ProjectInfo extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      showEditModal: false,
      showTypeParam: true,
      currentDials: 1,
      currentUserStatic: 1,
      nameFieldCheckedList: [],
      dialNameFieldCheckedList: [],
      businessPramaValues: [],
    });
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'projActions/loadProjectInfo',
      projectCode: id,
    });
  }

  componentDidMount() {
    console.log('Edit Proj Component DID Mount!');
    const { projectInfo } = this.props;
    // TODO 这个无法控制异步，甚至是同步的action
    if (projectInfo) {
      console.log('loading business params....when did mount');
      // const { businessCode } = projectInfo;
      // this.loadBusinessParams(businessCode);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { loadingProjectInfo, projectInfo, match } = this.props;
    const loadingProjectInfoPre = prevProps.loadingProjectInfo;
    const projectInfoPre = prevProps.projectInfo ? prevProps.projectInfo : { projectCode: '1111111-111111-111111-111111' };
    // console.log('Component DID UPDATE!', projectInfo, projectInfoPre);
    const { id } = match.params;
    if (projectInfo && projectInfo.projectCode === id && projectInfo.projectCode !== projectInfoPre.projectCode) {
      console.log('loading business params projectInfo....when did update');
      const { businessCode } = projectInfo;
      this.loadBusinessParams(businessCode);
    }
    // if (loadingProjectInfo === false && loadingProjectInfoPre === true) {
    //   console.log('loading business params....when did update');
    //   const { businessCode } = projectInfo;
    //   this.loadBusinessParams(businessCode);
    // }
  }

  getProjInfo = () => {
    const { projectInfo } = this.props;
    return projectInfo;
  }


  onCascaderChange = (value) => {
    const businessCode = value[0];
    this.loadBusinessParams(businessCode);
  };

  setTypePrams(value) {
    this.setState({
      businessPramaValues: value || [],
    });
  }

  SetBusinessName = (code) => {
    const { taskTypeList } = this.props;
    let name = '';
    taskTypeList.forEach((item) => {
      if (item.businessCode === code) {
        name = item.typeName;
      }
    });
    return name;
  };

  toBack = () => {
    router.push('/proj');
  }

  getNameCheckOPtions = (fileter = []) => {
    const { templateColums } = this.props;
    const nameLabeOptions = [];
    for (let i = 0; i < templateColums.length; i++) {
      if (fileter.indexOf(templateColums[i].columnCode) < 0) {
        nameLabeOptions.push(templateColums[i].name);
      }
    }
    return nameLabeOptions;
  }

  getNameShowFileds = (flag) => {
    const { templateColums } = this.props;
    const showFileds = [
    ];
    const { nameFieldCheckedList, dialNameFieldCheckedList } = this.state;
    const list = flag === 'dial' ? dialNameFieldCheckedList : nameFieldCheckedList;
    // TODO 此处可以思考更优的算法，字段不会太多怎么简单怎么来
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < templateColums.length; j++) {
        if (templateColums[j].name === list[i]) {
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

  onNameFieldChange = (checkedList) => {
    this.setState({
      nameFieldCheckedList: checkedList,
    });
  };

  onDialNameFieldChange = (checkedList) => {
    this.setState({
      dialNameFieldCheckedList: checkedList,
    });
  };

  onTabChange = (tabId) => {
    const { dispatch, projectCalls, businessSummary, match } = this.props;
    const { id } = match.params;
    if (tabId === 'dialListTab' && !projectCalls) {
      dispatch({
        type: 'projActions/getDialList',
        projectCode: id,
      });
    } else if (tabId === 'businessSummaryTab' && !businessSummary) {
      dispatch({
        type: 'projActions/getBusinessSummary',
        projectCode: id,
      });
    }
  }

  bindExportSummaryExcel = () => {
    const { match } = this.props;
    const { id } = match.params;
    const selectColumns = this.getNameShowFileds('summary');
    let qstr = `projectCode=${id}`;
    selectColumns.forEach((item) => {
      qstr += `&extCol=${item.dataIndex}`;
    });
    if (!selectColumns.length) {
      qstr += '&extCol=';
    }
    const url = `${BASE_URL}report/excel/userStatistic?${qstr}`;
    window.open(url, '_blank');
  }

  // 点击导出
  bindExportDialExcel = () => {
    const { match } = this.props;
    const { id } = match.params;
    const selectColumns = this.getNameShowFileds('dial');
    let qstr = `projectCode=${id}`;
    selectColumns.forEach((item) => {
      qstr += `&extCol=${item.dataIndex}`;
    });
    if (!selectColumns.length) {
      qstr += '&extCol=';
    }
    const url = `${BASE_URL}report/excel/recordList?${qstr}`;
    window.open(url, '_blank');
  };

  getDailData = ({ nameShowColums, dialTableData }) => {
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

  getSummaryData = ({ nameShowColums, tableData }) => {
    const data = [];
    const pickNames = [];
    nameShowColums.forEach((o) => {
      pickNames.push(o.dataIndex);
    });
    if (isArray(tableData) && tableData.length) {
      for (let i = 0; i < tableData.length; i++) {
        const item = tableData[i];
        const { valueList } = item;
        const pickedUserInfo = {
          rowKey: i,
          customerId: valueList[0] ? valueList[0].customerId : '',
        };
        valueList.forEach((c) => {
          if (pickNames.indexOf(c.columnCode) > -1) {
            pickedUserInfo[c.columnCode] = c.dataValue;
          }
        });
        data.push(Object.assign({}, item, pickedUserInfo));
      }
    }
    return data;
  }

  onPageChange = (page) => {
    this.setState({ currentUserStatic: page });
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'projActions/getUserStatics',
      projectCode: id,
      pageNum: page,
    });
  }

  onDialPageChange = (page) => {
    this.setState({ currentDials: page });
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'projActions/getDialList',
      projectCode: id,
      pageNum: page,
    });
  }

  doEditProj(e) {
    e.preventDefault();
    const { dispatch, projectInfo } = this.props;
    const { businessPramaValues } = this.state;
    const { projectCode } = projectInfo;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let startTime = '';
        let endTime = '';
        if (values.predictTime && values.predictTime.length) {
          startTime = values.predictTime[0].format('YYYY-MM-DD 00:00:00');
          endTime = values.predictTime[1].format('YYYY-MM-DD 23:59:59');
        }

        dispatch({
          type: 'projActions/editProj',
          data: {
            projectCode,
            businessCode: values.businessCode[0],
            projectName: values.projName,
            startTime,
            endTime,
            remark: values.remark,
            businessPramaValues,
          },
        });
      } else {
        message.error('输入有误');
      }
    });
  }

  toggerEditModal() {
    const { showEditModal } = this.state;
    const { isEdited } = this.props;


    this.setState({
      showEditModal: !showEditModal,
    });

    if (isEdited) {
      router.push('/proj');
    }
  }

  closeProjet() {
    const { projectInfo, dispatch } = this.props;
    const { projectCode } = projectInfo;
    dispatch({
      type: 'projActions/endProj',
      projectCode,
    });
  }

  SetBusinessParams() {
    const { projectInfo } = this.props;
    const { businessParamValueList } = projectInfo;
    let params = '';
    businessParamValueList.forEach((item) => {
      params += `${item.label} `;
    });
    return params;
  }

  loadBusinessParams(businessCode) {
    const { dispatch, taskTypeList } = this.props;
    let businessTypeId;
    taskTypeList.forEach((item) => {
      if (item.businessCode === businessCode) {
        businessTypeId = item.id;
      }
    });
    dispatch({
      type: 'projActions/getBusinessPramas',
      businessTypeId,
    });
  }

  render() {
    const Breadcrumb = createBreadcrumbs();
    const {
      projectInfo, taskTypeList, loadingBusinessParam, businessPramas, nameList,
      taskList, projectCalls, businessSummary,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const showCode = false;
    const {
      showEditModal, showTypeParam, nameFieldCheckedList, dialNameFieldCheckedList, currentUserStatic, currentDials,
    } = this.state;
    console.log(' render loadingBusinessParam:', loadingBusinessParam);
    if (!projectInfo) {
      return null;
    }
    const {
      projectName, createOper, businessCode, createTime, status,
      startTime, updateTime, endTime, finishTaskSum, totalContactSum,
      nostartTaskSum, auditTaskSum, remark, taskSum, businessParamValueList,
    } = projectInfo;
    const businessName = this.SetBusinessName(businessCode);
    const businessParams = this.SetBusinessParams();
    const { nameColumns, nameDatas, totalNames, nameCustormIds } = dynamicNameTableData(nameList);
    const namesPagination = {
      pageSize: PAGE_SIZE,
      total: businessSummary ? businessSummary.totalCount : 0,
      current: currentUserStatic,
      onChange: (page, pageSize) => { this.onPageChange(page, pageSize); },
    };
    const nameLabeOptions = this.getNameCheckOPtions();
    const nameShowColums = this.getNameShowFileds('summary');
    const dynamicSummaryData = this.getSummaryData({ nameShowColums, nameCustormIds, nameDatas, tableData: businessSummary ? businessSummary.list : [] });
    nameShowColums.push({
      title: '客户ID',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (text, record) => {
        const subStr = text.substring(0, 12);
        return (
          <Tooltip placement='topLeft' title={text} arrowPointAtCenter>
            {subStr}...
          </Tooltip>
        );
      },
    });
    nameShowColums.push({ title: '拨打次数', dataIndex: 'callCount', key: 'callCount' });
    nameShowColums.push({
      title: '最后外呼时间',
      dataIndex: 'lastCallTime',
      key: 'lastCallTime',
      render: (text, record) => {
        const { lastCallTime } = record;
        if (!lastCallTime || lastCallTime === '') {
          return '';
        } else {
          return moment(lastCallTime).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    });
    nameShowColums.push({ title: '呼叫结果', dataIndex: 'callResult', key: 'callResult' });
    nameShowColums.push({ title: '应答时长(s)', dataIndex: 'answerDuration', key: 'answerDuration' });
    nameShowColums.push({ title: '意图', dataIndex: 'intentText', key: 'intentText' });
    const NamesTable = createTable(nameShowColums, dynamicSummaryData, 'rowKey', false, 'middle', null, namesPagination, { padding: '0 24px' });

    const taskColumns = projTaskColumns(this.props);
    const TaskTableComponent = createTable(taskColumns, taskList, 'taskId', false, 'middle', null, null, { paddingTop: '1px' });


    const dialTableData = projectCalls ? projectCalls.list : [];
    const dialsTotal = projectCalls ? projectCalls.totalCount : 0;

    const dialsPagination = {
      pageSize: PAGE_SIZE,
      total: dialsTotal,
      current: currentDials,
      onChange: (page, pageSize) => { this.onDialPageChange(page, pageSize); },
    };

    // 拨打记录相关
    const dialNameLabeOptions = this.getNameCheckOPtions(['phone']);
    const dialNameShowColums = this.getNameShowFileds('dial');
    const dynamicDialData = this.getDailData({ nameShowColums: dialNameShowColums, nameCustormIds, nameDatas, dialTableData });
    const dialcolumns = dialNameShowColums.concat(dialColumns(this.props));


    const DialsTable = createTable(dialcolumns, dynamicDialData, 'callId', false, 'middle', null, dialsPagination, { padding: '0 24px' });

    return (
      <div>
        <Breadcrumb />
        <div className={styles.main}>
          <div className={styles.head}>
            <div>
              <div className={styles.task_first}>
                <span>项目名称：</span><span>{projectName}</span>
                <div className={styles.first_btn}>
                  <Button onClick={this.toBack}>返 回</Button>
                  {taskSum < 1 && status !== 2 ? (
                    <Button type='primary' onClick={() => { this.toggerEditModal(); }} >修 改</Button>
                  ) : null
                  }
                  {status !== 2 ? (
                    <span>
                      <Button type='dashed' className={styles.no} onClick={() => this.closeProjet()}>结 束</Button>

                    </span>
                  ) : null}
                </div>
              </div>
              <div className={styles.task_second}>
                <div>
                  <p>
                    <span>{createOper}</span><span>于</span><span>{getDateTime(createTime)}</span><span>创建项目</span>
                  </p>
                  <p>
                    <span>业务类型：</span><span>{ businessName}</span>
                    <span> 业务参数：</span><span>{ businessParams }</span>
                  </p>
                  <p>
                    <span>项目说明：</span><span>{ remark}</span>
                  </p>
                  <p>
                    <span>预计起止时间：</span><span>{getDateTime(startTime)}至{getDateTime(endTime)}</span><span>   更新时间：</span><span>{getDateTime(updateTime)}</span>
                  </p>
                  <p>
                    <span>总计任务:</span><span>{taskSum}个</span>
                    <span>，已完成：</span><span>{finishTaskSum}个</span>
                    <span>，未开始：</span><span>{nostartTaskSum}个</span>
                    <span>，待审核：</span><span>{auditTaskSum}个</span>
                  </p>
                </div>
                <div>
                  <p>-</p>
                  <p><span>状态：</span><span>{getProjStatusName(status)}</span></p>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey='1'
            tabBarStyle={{ background: '#FFFFFF', padding: '0 24px', marginTop: '3px' }}
            onChange={activeKeyid => this.onTabChange(activeKeyid)}
          >
            <TabPane tab='任务列表' key='taskListTab'>
              <div style={{ padding: '10px 24px' }}>
                <Spin
                  tip='正在加载...'
                  spinning={false}
                >
                  { TaskTableComponent }
                </Spin>
              </div>
            </TabPane>
            <TabPane tab='项目明细表' key='businessSummaryTab'>
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
                    <Button type='primary' icon='copy' onClick={this.bindExportSummaryExcel} >导出</Button>
                  </Col>
                </Row>
              </div>
              { NamesTable }
            </TabPane>
            <TabPane tab='项目拨打记录' key='dialListTab'>
              <div style={{ marginBottom: '14px' }}>
                <Row>
                  <Col span={16} offset={1}>
                    <span>请选择所需名单列：</span>
                    <CheckboxGroup
                      options={dialNameLabeOptions}
                      value={dialNameFieldCheckedList}
                      onChange={this.onDialNameFieldChange}
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
        </div>
        <Modal
          title='项目编辑'
          visible={showEditModal}
          destroyOnClose
          onCancel={() => { this.toggerEditModal(); }}
          footer={[]}
        >
          <Form
            onSubmit={e => this.doEditProj(e)}
            className={styles.form}
          >
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='项目名称：'
            >
              {getFieldDecorator('projName', {
                rules: [{ required: true, message: '请输项目名称!' }],
                initialValue: projectName,
              })(
                <Input placeholder='请输入项目名称'/>,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='业务类型：'
            >
              {getFieldDecorator('businessCode', {
                initialValue: [businessCode],
                rules: [{ required: true, message: '请选择业务类型!' }],
              })(
                <Cascader
                  allowClear={false}
                  options={taskTypeList}
                  fieldNames={{ label: 'typeName', value: 'businessCode', children: 'items' }}
                  onChange={this.onCascaderChange}
                  placeholder='请选择业务类型'
                />,
              )}
            </Form.Item>
            { showTypeParam && (
              <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='项目参数：'
              >
                <ProjBusinessPramas
                  businessPramas={businessPramas}
                  loadingBusinessParam={loadingBusinessParam}
                  setTypePrams={(value) => { this.setTypePrams(value); }}
                  defaultValues={businessParamValueList}
                />
              </Form.Item>
            )}
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='预计起止时间：'
            >
              {getFieldDecorator('predictTime', {
                initialValue: startTime && endTime ? [moment(startTime), moment(endTime)] : [],
                rules: [{ required: false }],
              })(
                <RangePicker />,
              )}
            </Form.Item>

            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='项目说明：'
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
                rules: [{ required: false }],
              })(
                <TextArea
                  placeholder='请输入项目描述或者其他信息'
                  initialvalue=''
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 24 }}
              className={styles.btn_group_2}
            >
              <Row>
                <Col span={6} offset={6}>
                  <Button type='primary' icon='save' htmlType='submit' loading={false} style={{ marginRight: '10px' }}>
                  提 交
                  </Button>
                </Col>
                <Col span={6}>
                  <Button icon='left' onClick={() => { this.toggerEditModal(); }}>返 回</Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default ProjectInfo;
