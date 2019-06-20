import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button, Input, TreeSelect, Spin, Row, Col,
} from 'antd';
import router from 'umi/router';

import { createTreeSelect } from '@/components/TreeSelects';
import ModalBar from '@/components/ModalBar';
import styles from './index.less';

const { TextArea } = Input;
const { SHOW_PARENT } = TreeSelect;

// 新增角色Page
@connect(({ loading, roleActions }) => ({
  getResourceListLoading: loading.effects['roleActions/getResourceList'],
  addRoleLoading: loading.effects['roleActions/addRole'],
  resourceList: roleActions.resourceList,
  showModal: roleActions.showModal,
}))
class AddRole extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      roleName: '',
      remark: '',
      value: [],
    });
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleActions/getResourceList',
    });
  }

  onInputChange = (e) => {
    this.setState({
      roleName: e.target.value,
    });
  };

  textAreaChange = (e) => {
    this.setState({
      remark: e.target.value,
    });
  };

  handleSubmit = () => {
    const { dispatch, resourceList } = this.props;
    const { roleName, value, remark } = this.state;
    const fullSelectChildren = []; //全选时，只会有父节点 单独处理
    resourceList.forEach((element, index) => {
      if (value.indexOf(element.resourceId) > -1 && element.childResourceList.length) {
        element.childResourceList.forEach((item, j) => {
          fullSelectChildren.push(item.resourceId);
        });
      }
    });
    dispatch({
      type: 'roleActions/addRole',
      data: {
        roleName,
        value: value.concat(fullSelectChildren),
        remark,
      },
    });
  };

  toBack = () => {
    router.goBack();
  };

  onChange = (value) => {
    this.setState({
      value,
    });
  };

  // model确认
  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleActions/closeModel',
    });
    this.toBack();
  };

  render() {
    const {
      getResourceListLoading, addRoleLoading, resourceList, showModal,
    } = this.props;
    const { value } = this.state;

    const treeProps = {
      value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择权限',
      style: {
        width: '100%',
      },
    };

    const treeSelect = createTreeSelect(treeProps, resourceList !== undefined ? resourceList.filter(item => item.resourceId !== 4 && item.resourceId !== 5) : []);

    return (
      <div className={styles.main}>
        <Spin
          tip='正在加载...'
          spinning={getResourceListLoading}
        >
          <div className={styles.form}>
            <Row className={styles.item}>
              <Col span={5} className={styles.col}>
                <label>角色名：</label>
              </Col>
              <Col span={18} offset={1}>
                <Input className={styles.input} placeholder='请输入角色名' onChange={this.onInputChange}/>
              </Col>
            </Row>
            <Row className={styles.item}>
              <Col span={5} className={styles.col}>
                <label>权限：</label>
              </Col>
              <Col span={18} offset={1}>
                {treeSelect}
              </Col>
            </Row>
            <Row className={styles.item}>
              <Col span={5} className={styles.col}>
                <label>备注：</label>
              </Col>
              <Col span={18} offset={1}>
                <TextArea className={styles.text} onChange={this.textAreaChange}/>
              </Col>
            </Row>
          </div>
          <div className={styles.btn_group}>
            <Button
              type='primary'
              style={{ marginRight: '121px' }}
              onClick={this.handleSubmit}
              loading={addRoleLoading}
            >
              提交
            </Button>
            <Button onClick={this.toBack}>返回</Button>
          </div>
        </Spin>
        <ModalBar loading={showModal} title='成功' backText='返回' text='角色新建成功！' handleOk={this.handleOk}/>
      </div>
    );
  }
}

export default AddRole;
