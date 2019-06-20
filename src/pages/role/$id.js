import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button, Input, TreeSelect, Spin, Row, Col,
} from 'antd';
import router from 'umi/router';

import { createTreeSelect } from '@/components/TreeSelects';
import ModalBar from '@/components/ModalBar';
import styles from './$id.less';

const { TextArea } = Input;
const { SHOW_PARENT } = TreeSelect;

// 修改角色Page
@connect(({ loading, roleActions }) => ({
  getRoleInfoLoading: loading.effects['roleActions/getRoleInfo'],
  updateRoleInfoLoading: loading.effects['roleActions/updateRoleInfo'],
  roleInfo: roleActions.roleInfo,
  resourceList: roleActions.resourceList,
  oriSelectedKeys: roleActions.oriSelectedKeys,
  showModal: roleActions.showModal,
}))
class EditRole extends Component {
  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'roleActions/getRoleInfo',
      data: {
        roleId: match.params.id,
      },
    });
  }

  textAreaChange = () => {
    // this.setState({
    //   areaText: e.target.value,
    // });
  };

  handleSubmit = () => {
    const { dispatch, oriSelectedKeys, roleInfo } = this.props;
    dispatch({
      type: 'roleActions/updateRoleInfo',
      data: {
        ...roleInfo,
        resourceList: oriSelectedKeys,
      },
    });
  };

  toBack = () => {
    router.goBack();
  };

  onChange = (value) => {
    const { dispatch, resourceList } = this.props;
    const fullSelectChildren = []; //全选时，只会有父节点 单独处理
    resourceList.forEach((element, index) => {
      if (value.indexOf(element.resourceId) > -1 && element.childResourceList.length) {
        element.childResourceList.forEach((item, j) => {
          fullSelectChildren.push(item.resourceId);
        });
      }
    });
    dispatch({
      type: 'roleActions/changeSelectedKey',
      oriSelectedKeys: value.concat(fullSelectChildren),
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
      getRoleInfoLoading, roleInfo, resourceList, oriSelectedKeys, showModal, updateRoleInfoLoading,
    } = this.props;

    let role = {
      roleName: '',
    };
    if (roleInfo !== '' && roleInfo !== undefined) {
      role = roleInfo;
    }

    const treeProps = {
      value: oriSelectedKeys,
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
          spinning={getRoleInfoLoading}
        >
          <div className={styles.form}>
            <Row className={styles.item}>
              <Col span={5} className={styles.col}>
                <label>角色名：</label>
              </Col>
              <Col span={18} offset={1}>
                <Input className={styles.input} value={role.roleName} disabled/>
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
              loading={updateRoleInfoLoading}
            >
              提交
            </Button>
            <Button onClick={this.toBack}>返回</Button>
          </div>
        </Spin>
        <ModalBar loading={showModal} title='成功' backText='返回' text='角色修改成功!' handleOk={this.handleOk}/>
      </div>
    );
  }
}

export default EditRole;
