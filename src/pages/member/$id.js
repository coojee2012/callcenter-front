import React, { Component } from 'react';
import {
  Button, Input, Transfer, Form, Spin, Switch,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import { getDateTime } from '@/utils/common';
import { FORM_ITEM_LAYOUT, FORM_BTN_LAYOUT } from '@/utils/constant';
import styles from './$id.less';
import ModalBar from '@/pages/member/add';

// 操作员详情Page
@connect(({ loading, memberActions, roleActions }) => ({
  getMemberInfoLoading: loading.effects['memberActions/getMemberInfo'],
  updateMemberLoading: loading.effects['memberActions/updateMember'],
  roleList: roleActions.roleList,
  memberInfo: memberActions.memberInfo,
  loading: memberActions.loading,
  showModal: memberActions.showModal,
  oriSelectedKeys: memberActions.oriSelectedKeys,
  switchCheck: memberActions.switchCheck,
}))
@Form.create()
class EditMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'roleActions/getRoleList',
    });
    dispatch({
      type: 'memberActions/getMemberInfo',
      data: {
        operId: match.params.id,
      },
    });
  }

  handleChange = (nextTargetKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberActions/changeSelectedKey',
      oriSelectedKeys: nextTargetKeys,
    });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { memberInfo, dispatch, oriSelectedKeys } = this.props;
      if (!err) {
        dispatch({
          type: 'memberActions/updateMember',
          data: {
            ...values,
            operId: memberInfo.operId,
            roles: oriSelectedKeys,
          },
        });
      } else {
        console.log('输入有误');
      }
    });
  };

  toBack = () => {
    router.goBack();
  };

  // model确认
  handleOk = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memberActions/closeModel',
    });
    this.toBack();
  };

  render() {
    const { selectedKeys } = this.state;
    const {
      memberInfo, getMemberInfoLoading, roleList, showModal, oriSelectedKeys, updateMemberLoading,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const info = {
      operName: '',
      account: '',
      enable: 0,
      createTime: '',
    };
    if (memberInfo !== undefined) {
      info.operName = memberInfo.operName;
      info.account = memberInfo.account;
      info.enable = memberInfo.enable;
      info.createTime = getDateTime(memberInfo.createTime);
    }

    return (
      <div className={styles.main}>
        <Spin
          tip="正在加载...'"
          spinning={getMemberInfoLoading}
        >
          <Form
            onSubmit={this.handleSubmit}
            className={styles.form}
          >
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='姓名：'
            >
              {getFieldDecorator('operName', {
                rules: [{ required: true, message: '请输入姓名!' }],
                initialValue: info.operName,
              })(
                <Input placeholder='请输入姓名'/>,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='用户名：'
            >
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入用户名!' }],
                initialValue: info.account,
              })(
                <Input placeholder='请输入用户名'/>,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='状态：'
            >
              {getFieldDecorator('enable', {
                initialValue: info.enable === 1,
                valuePropName: 'checked',
              })(
                <Switch
                  checkedChildren='启用'
                  unCheckedChildren='停用'
                />,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='分组角色1111：'
            >
              {getFieldDecorator('roles', {})(
                <Transfer
                  dataSource={roleList}
                  titles={['可选', '已选']}
                  targetKeys={oriSelectedKeys}
                  selectedKeys={selectedKeys}
                  className={styles.trans}
                  onChange={this.handleChange}
                  onSelectChange={this.handleSelectChange}
                  onScroll={this.handleScroll}
                  render={item => item.roleName}
                  rowKey={record => record.roleId}
                />,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_BTN_LAYOUT}
              className={styles.btn_group}
            >
              <Button type='primary' htmlType='submit' style={{ marginRight: '121px' }} loading={updateMemberLoading}>
                提 交
              </Button>
              <Button onClick={this.toBack}>返回</Button>
            </Form.Item>
          </Form>
        </Spin>
        {/* <ModalBar loading={showModal} title='成功' backText='返回' text='用户修改成功!' handleOk={this.handleOk}/> */}
      </div>
    );
  }
}

export default EditMember;
