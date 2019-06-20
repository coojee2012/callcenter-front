import React, { Component } from 'react';
import {
  Button, Tabs, Spin, Form, Modal, List, Cascader, DatePicker, message, Input, Col, Row,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { createBreadcrumbs } from '@/components/Breakcrumbs';
import { createTable } from '@/components/Tables';
import { getDateTime, dynamicNameTableData } from '@/utils/common';
import ModalBar from '@/components/ModalBar';
import TextArea from 'antd/lib/input/TextArea';

import styles from './$id.less';

import { FORM_ITEM_LAYOUT, PAGE_SIZE } from '@/utils/constant';

const { TabPane } = Tabs;
@connect(({ rosterActions, loading }) => ({
  rosterList: rosterActions.rosterList,
  rosterInfo: rosterActions.rosterInfo,
  nameList: rosterActions.nameList,
  showEditModal: rosterActions.showEditModal,
  taskTypeList: rosterActions.taskTypeList,
  isEdited: rosterActions.isEdited,
}))
@Form.create()
class RosterInfo extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      current: 1,
      showTypeParam: true,
      businessPramaValues: [],
    });
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { id } = match.params;
    dispatch({
      type: 'rosterActions/loadRosterInfo',
      rosterId: id,
    });
  }

  componentDidMount() {
    console.log('Edit Roster Component DID Mount!');
    const { rosterInfo } = this.props;
    // TODO 这个无法控制异步，甚至是同步的action
    if (rosterInfo) {
      console.log('loading business params....when did mount');
    }
  }

  componentDidUpdate(prevProps, prevState) {

  }

  getProjInfo = () => {
    const { projectInfo } = this.props;
    return projectInfo;
  }


  onCascaderChange = (value) => {
    const businessCode = value[0];
    this.loadBusinessParams(businessCode);
  };

  onPageChange = (page) => {
    this.setState({ current: page });
    const { dispatch, match } = this.props;
    dispatch({
      type: 'rosterActions/getRosterNames',
      data: {
        pageNum: page,
        rosterId: match.params.id,
      },
    });
  }

  setTypePrams(value) {
    this.setState({
      businessPramaValues: value || [],
    });
  }

  toBack = () => {
    router.push('/roster');
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

  doEditProj(e) {
    e.preventDefault();
    const { dispatch, rosterInfo } = this.props;
    const { businessPramaValues } = this.state;
    const { rosterId } = rosterInfo;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'rosterActions/editRoster',
          data: {
            rosterId,
            rosterName: values.rosterName,
          },
        });
      } else {
        message.error('输入有误');
      }
    });
  }

  toggerEditModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rosterActions/toggerEditModal',
    });
  }


  closeProjet() {
    const { projectInfo, dispatch } = this.props;
    const { projectCode } = projectInfo;
    dispatch({
      type: 'projActions/endProj',
      projectCode,
    });
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
    const { rosterInfo, nameList, showEditModal } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { current } = this.state;
    if (!rosterInfo) {
      return null;
    }
    const {
      rosterName, createOper, businessCode, createTime, customerCount,
    } = rosterInfo;
    const businessName = this.SetBusinessName(businessCode);


    const { nameColumns, nameDatas, totalNames } = dynamicNameTableData(nameList);
    const namesPagination = {
      pageSize: PAGE_SIZE,
      total: totalNames,
      current,
      onChange: (page, pageSize) => { this.onPageChange(page, pageSize); },
    };

    const Table = createTable(nameColumns, nameDatas, 'customerId', false, 'middle', null, namesPagination, { padding: '0 24px' });
    return (
      <div>
        <Breadcrumb />
        <div className={styles.main}>
          <div className={styles.head}>
            <div>
              <div className={styles.task_first}>
                <span>名称：</span><span>{rosterName}</span>
                <div className={styles.first_btn}>
                  <Button icon='left' onClick={this.toBack}>返 回</Button>
                  <Button type='primary' icon='edit' onClick={() => { this.toggerEditModal(); }} >修 改</Button>
                </div>
              </div>
              <div className={styles.task_second}>
                <div>
                  <p>
                    <span>{createOper}</span><span>于</span><span>{getDateTime(createTime)}</span><span>创建名单</span>
                  </p>
                  <p>
                    <span>业务类型：</span><span>{ businessName}</span>
                  </p>
                  {/* <p>
                    <span>名单说明：</span><span>{ remark}</span>
                  </p> */}
                  <p>
                    <span>名单数：</span><span>{ customerCount }</span>
                  </p>
                </div>
                <div>
                  <p>-</p>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey='1'
            tabBarStyle={{ background: '#FFFFFF', padding: '0 24px', marginTop: '3px' }}
          >
            <TabPane tab='名单列表' key='1'>{Table}</TabPane>
          </Tabs>
        </div>
        <Modal
          title='名单编辑'
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
              label='名单名称：'
            >
              {getFieldDecorator('rosterName', {
                rules: [{ required: true, message: '请输名单名称!' }],
                initialValue: rosterName,
              })(
                <Input placeholder='请输入名单名称'/>,
              )}
            </Form.Item>
            {/* <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='名单说明：'
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
                rules: [{ required: false }],
              })(
                <TextArea
                  placeholder='请输入名单描述或者其他信息'
                  initialvalue={remark}
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item> */}
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
export default RosterInfo;
