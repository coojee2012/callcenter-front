import React, { Component } from 'react';
import {
  Button, Input, Transfer, Spin, Form,
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

import { FORM_ITEM_LAYOUT, FORM_BTN_LAYOUT } from '@/utils/constant';
import ModalBar from '@/components/ModalBar';
import styles from './index.less';


// 新增任务Page
@connect(({ loading, memberActions, roleActions }) => ({
  getRoleListLoading: loading.effects['roleActions/getRoleList'],
  registerMemberLoading: loading.effects['memberActions/registerMember'],
  roleList: roleActions.roleList,
  pass: memberActions.pass,
  showModal: memberActions.showModal,
}))
@Form.create()
class AddNewMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
      selectedKeys: [],
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleActions/getRoleList',
    });
    dispatch({
      type: 'memberActions/getRoleList',
    });
  }

  handleChange = (nextTargetKeys) => {
    this.setState({
      targetKeys: nextTargetKeys,
    });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  };

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  // 点击提交事件
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'memberActions/registerMember',
          data: values,
        });
      } else {
        console.log('输入有误');
      }
    });
  };

  // 返回
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
    const {
      roleList, getRoleListLoading, showModal, pass, registerMemberLoading,
    } = this.props;
    const { selectedKeys, targetKeys } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.main}>
        <Spin
          tip='正在加载...'
          spinning={getRoleListLoading}
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
              })(
                <Input placeholder='请输入用户名'/>,
              )}
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='分组角色：'
            >
              {getFieldDecorator('roles', {})(
                <Transfer
                  dataSource={roleList}
                  titles={['可选', '已选']}
                  targetKeys={targetKeys}
                  selectedKeys={selectedKeys}
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
              <Button
                type='primary'
                htmlType='submit'
                style={{ marginRight: '121px' }}
                loading={registerMemberLoading}
              >
                提 交
              </Button>
              <Button onClick={this.toBack}>返回</Button>
            </Form.Item>
          </Form>
        </Spin>
        <ModalBar loading={showModal} title='请记录临时密码' backText='确认' text={pass} handleOk={this.handleOk}/>
      </div>
    );
  }
}

export default AddNewMember;
