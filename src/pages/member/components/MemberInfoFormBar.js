import React, { Component } from 'react';
import {
  Button, Input, Transfer, Form, Switch,
} from 'antd';
import router from 'umi/router';

import { FORM_ITEM_LAYOUT, FORM_BTN_LAYOUT } from '@/utils/constant';
import styles from './MemberInfoFormBar.less';


// 操作员FormBar 暂无使用
@Form.create()
class MemberInfoFormBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: [],
      selectedKeys: [],
    };
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
    const {
      dispatch, defaultValue, memberInfo, oriSelectedKeys,
    } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (defaultValue) {
          dispatch({
            type: 'memberActions/updateMember',
            data: {
              ...memberInfo,
              ...values,
              roles: oriSelectedKeys,
            },
          });
        } else {
          dispatch({
            type: 'memberActions/registerMember',
            data: values,
          });
        }
      } else {
        console.log('输入有误');
      }
    });
  };

  // 返回
  toBack = () => {
    router.goBack();
  };

  render() {
    const {
      roleList, registerMemberLoading, defaultValue, oriSelectedKeys, updateMemberLoading,
    } = this.props;
    const { selectedKeys, targetKeys } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
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
            initialValue: defaultValue.operName || '',
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
            initialValue: defaultValue.account || '',
          })(
            <Input placeholder='请输入用户名'/>,
          )}
        </Form.Item>
        {defaultValue && (
          <Form.Item
            {...FORM_ITEM_LAYOUT}
            label='状态：'
          >
            {getFieldDecorator('enable', {
              initialValue: defaultValue.enable === 1,
              valuePropName: 'checked',
            })(
              <Switch
                checkedChildren='启用'
                unCheckedChildren='停用'
              />,
            )}
          </Form.Item>
        )}
        {defaultValue && (
          <Form.Item
            {...FORM_ITEM_LAYOUT}
            label='创建时间：'
          >
            <p>{defaultValue.createTime}</p>
          </Form.Item>
        )}
        <Form.Item
          {...FORM_ITEM_LAYOUT}
          label='分组角色：'
        >
          {getFieldDecorator('roles', {})(
            <Transfer
              dataSource={roleList}
              titles={['可选', '已选']}
              targetKeys={defaultValue ? oriSelectedKeys : targetKeys}
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
            loading={defaultValue ? updateMemberLoading : registerMemberLoading}
          >
            提 交
          </Button>
          <Button onClick={this.toBack}>返回</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default MemberInfoFormBar;
