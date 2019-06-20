import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button, Input, Modal, Form,
} from 'antd';

import router from 'umi/router';
import { createBreadcrumbs } from '@/components/Breakcrumbs';
import { FORM_ITEM_LAYOUT } from '@/utils/constant';
import { getDateTime } from '@/utils/common';
import styles from './index.less';

// 个人Page
@connect(({ loading, userActions }) => ({
  updatePwdLoading: loading.effects['userActions/updatePwd'],
  showModal: userActions.showModal,
  isLogin: userActions.isLogin,
}))
@Form.create()
class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: sessionStorage.getItem('operName'),
      account: sessionStorage.getItem('account'),
      initialFlag: sessionStorage.getItem('initialFlag'),
      createTime: getDateTime(sessionStorage.getItem('createTime')),
    };
  }


  componentDidMount() {
    const initialFlag = sessionStorage.getItem('initialFlag');
    if (initialFlag === '1') {
      this.passDisabled();
    }
  }

  passDisabled = () => {
    const { dispatch, showModal } = this.props;
    dispatch({
      type: 'userActions/changeStatus',
      data: showModal,
    });
  };

  changePass = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'userActions/updatePwd',
          data: {
            ...values,
            operId: sessionStorage.getItem('operId'),
          },
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.log('输入有误');
      }
    });
  };


  render() {
    const Breadcrumb = createBreadcrumbs();
    const { updatePwdLoading, showModal, isLogin } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { initialFlag } = this.state;
    const modalTile = initialFlag === '1' ? '首次登陆需要修改密码后才能使用' : '修改密码';
    return (
      <div>
        <Breadcrumb/>
        <div className={styles.main}>
          <Form
            onSubmit={this.changePass}
            className={styles.form}
          >
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='姓名：'
            >
              <Input disabled defaultValue={this.state.name}/>
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='用户名：'
            >
              <Input disabled defaultValue={this.state.account}/>
            </Form.Item>
            <Form.Item
              {...FORM_ITEM_LAYOUT}
              label='创建时间：'
            >
              <Input disabled defaultValue={this.state.createTime}/>
            </Form.Item>
          </Form>
          <div className={styles.btn_group}>
            <Button onClick={this.passDisabled}>修改密码</Button>
          </div>
          <Modal
            title={modalTile}
            visible={showModal}
            onCancel={this.passDisabled}
            footer={[]}
          >
            <Form
              onSubmit={this.changePass}
              className={styles.form}
            >
              <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='原密码：'
              >
                {getFieldDecorator('oldPwd', {
                  rules: [{ required: true, message: '请输入原密码!' }],
                })(
                  <Input.Password placeholder='请输入原密码'/>,
                )}
              </Form.Item>
              <Form.Item
                {...FORM_ITEM_LAYOUT}
                label='新密码：'
              >
                {getFieldDecorator('newPwd', {
                  rules: [{ required: true, message: '请输入新密码!' }],
                })(
                  <Input.Password placeholder='请输入新密码'/>,
                )}
              </Form.Item>
              <Form.Item
                wrapperCol={{ span: 24 }}
                className={styles.btn_group_2}
              >
                <Button type='primary' htmlType='submit' loading={updatePwdLoading} style={{ marginRight: '50px' }}>
                  提 交
                </Button>

                {initialFlag !== '1' && <Button onClick={this.passDisabled}>返 回</Button>}
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

export default UserPage;
