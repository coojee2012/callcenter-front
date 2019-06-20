import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Form, Icon, Input, Button, Row, Col,
} from 'antd';

import styles from './LoginForm.less';

// 登录Page
@connect(({ loading, userActions }) => ({
  captcha: userActions.captcha,
  userInfo: userActions.userInfo,
  isLogin: userActions.isLogin,
  submitting: loading.effects['userActions/login'],
}))
@Form.create()
class LoginFormComponent extends Component {
  componentWillMount() {
    const { isLogin } = sessionStorage;
    // 判断是否登录并跳转
    if (isLogin) {
      router.push('/');
    }
  }

  componentDidMount() {
    const { isLogin } = sessionStorage;
    const { dispatch } = this.props;
    dispatch({
      type: 'userActions/getCaptcha',
    });
  }

  componentDidUpdate() {
    const { isLogin } = sessionStorage;
    // 判断是否登录并跳转
    if (isLogin) {
      router.push('/');
    }
  }

  // 点击登录事件
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'userActions/login',
          data: values,
        });
      } else {
        console.log('输入有误');
      }
    });
  };

  // 点击刷新验证码
  refreshCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userActions/getCaptcha',
    });
  };

  render() {
    const { submitting, captcha } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit}
        className={styles.main}
      >
        <Form.Item className={styles.account}>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '请输入账号!' }],
          })(
            <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }}/>} placeholder='账号'/>,
          )}
        </Form.Item>
        <Form.Item className={styles.password}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }}/>} type='password' placeholder='密码'/>,
          )}
        </Form.Item>
        <Form.Item className={styles.verification}>
          <Row>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: '请输入验证码!' }],
              })(
                <Input
                  className={styles.code}
                  prefix={<Icon type='tag' style={{ color: 'rgba(0,0,0,.25)' }}/>}
                  placeholder='验证码'
                />,
              )}
            </Col>
            <Col span={12}>
              <div>
                <img src={captcha} alt=''/>
                <a href='javascript:void(0);' onClick={this.refreshCode}>点击刷新验证码</a>
              </div>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className={styles.btn} loading={submitting}>
            登 录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginFormComponent;
